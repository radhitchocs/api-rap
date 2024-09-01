import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { OrderEntity } from '../../orders/schema/order.schema';
import { ProductEntity } from '../../products/schema/product.schema';
import * as dayjs from 'dayjs';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(OrderEntity.name) private orderModel: Model<OrderEntity>,
    @InjectModel(ProductEntity.name) private productModel: Model<ProductEntity>,
  ) {}

  async getTopFrequentlyBoughtProducts(limit: number = 10): Promise<string[]> {
    const pipeline: PipelineStage[] = [
      {
        $group: {
          _id: '$product',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          product: '$_id',
        },
      },
    ];

    const result = await this.orderModel.aggregate(pipeline);
    return result.map((item) => item.product);
  }

  async getTopFrequentlyOrderedProductsByQuantity(
    limit: number = 10,
  ): Promise<{ [key: string]: number }> {
    const pipeline: PipelineStage[] = [
      {
        $group: {
          _id: '$product',
          totalQuantity: { $sum: '$qty' },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          product: '$_id',
          totalQuantity: 1,
        },
      },
    ];

    const result = await this.orderModel.aggregate(pipeline);
    return result.reduce((acc, item) => {
      acc[item.product] = item.totalQuantity;
      return acc;
    }, {});
  }

  async getTotalRevenue() {
    const result = await this.orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalBuyPrice: { $sum: '$buy_price' },
          totalSellPrice: { $sum: '$total' },
        },
      },
    ]);

    if (result.length > 0) {
      const { totalBuyPrice, totalSellPrice } = result[0];
      const profit = totalSellPrice - totalBuyPrice;
      return { totalBuyPrice, totalSellPrice, profit };
    }

    return { totalBuyPrice: 0, totalSellPrice: 0, profit: 0 };
  }

  async getProfitGrowth() {
    const orders = await this.orderModel.find().exec();
    const summary = orders.reduce(
      (all, order) => {
        const month = dayjs(order.createdAt).format('MMM');
        all[month] += order.total - order.buy_price;
        return all;
      },
      {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      },
    );
    return summary;
  }

  async getAnalyticsDashboard() {
    return {
      topFrequentlyBoughtProducts: await this.getTopFrequentlyBoughtProducts(),
      topFrequentlyOrderedProductsByQuantity:
        await this.getTopFrequentlyOrderedProductsByQuantity(),
      totalRevenue: await this.getTotalRevenue(),
      profitGrowth: await this.getProfitGrowth(),
    };
  }
}
