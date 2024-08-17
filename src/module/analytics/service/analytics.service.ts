import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderEntity } from '../../orders/schema/order.schema';
import { ProductEntity } from '../../products/schema/product.schema';
import * as dayjs from 'dayjs';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(OrderEntity.name) private orderModel: Model<OrderEntity>,
    @InjectModel(ProductEntity.name) private productModel: Model<ProductEntity>,
  ) {}

  async getTopFrequentlyBoughtProducts(limit: number = 5) {
    return this.orderModel.aggregate([
      { $unwind: '$product_id' },
      { $group: { _id: '$product_id', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          product: '$product.name',
          count: 1,
        },
      },
    ]);
  }

  async getTopFrequentlyOrderedProductsByQuantity(limit: number = 5) {
    return this.orderModel.aggregate([
      { $unwind: '$product_id' },
      {
        $group: {
          _id: '$product_id',
          totalQuantity: { $sum: '$qty' }, // Sum the quantity ordered for each product
        },
      },
      { $sort: { totalQuantity: -1 } }, // Sort by total quantity ordered in descending order
      { $limit: limit }, // Limit to the top N products
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          product: '$product.name',
          totalQuantity: 1,
        },
      },
    ]);
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
        const month = dayjs(order.createdAt).format('MMM'); // Changed from createdAt to cdate
        all[month] += order.total - order.buy_price; // Added a fallback for buy_price
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
