import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, Types } from 'mongoose';
import { OrderPointEntity } from '../schema/order_point.schema';
import { CreateOrderPointDto } from '../dto/create-order_point.dto';
import { GetOrderPointDto } from '../dto/get-order_point.dto';
import { OrdersService } from 'src/module/orders/service/orders.service';
import { CustomersService } from 'src/module/customers/service/customers.service';
import { OrderPointDetailsService } from 'src/module/order_points_details/service/order-point-details.service';

@Injectable()
export class OrderPointsService {
  constructor(
    @InjectModel(OrderPointEntity.name)
    private readonly orderPointModel: PaginateModel<OrderPointEntity>,
    private readonly ordersService: OrdersService,
    private readonly customersService: CustomersService,
    private readonly orderPointDetailsService: OrderPointDetailsService,
  ) {}

  async create(dto: CreateOrderPointDto): Promise<OrderPointEntity> {
    const order = await this.ordersService.getById(
      new Types.ObjectId(dto.order_id),
    );
    if (!order) {
      throw new NotFoundException(`Order with ID "${dto.order_id}" not found`);
    }

    const customer = await this.customersService.getById(
      new Types.ObjectId(dto.customer_id),
    );
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID "${dto.customer_id}" not found`,
      );
    }

    const newOrderPoint = new this.orderPointModel({
      order_id: new Types.ObjectId(dto.order_id),
      customer_id: new Types.ObjectId(dto.customer_id),
      total_points_earned: dto.total_points_earned,
      created_at: dto.created_at,
    });

    const savedOrderPoint = await newOrderPoint.save();

    // Create order point details automatically
    for (const detail of dto.order_point_details) {
      await this.orderPointDetailsService.create({
        order_point_id: savedOrderPoint._id as Types.ObjectId,
        product_id: new Types.ObjectId(detail.product_id),
        points_earned: detail.points_earned,
      });
    }

    return savedOrderPoint;
  }

  async get(dto: GetOrderPointDto): Promise<OrderPointEntity[]> {
    const { order_id, customer_id } = dto;
    const filter: any = {};
    if (order_id) filter.order_id = new Types.ObjectId(order_id);
    if (customer_id) filter.customer_id = new Types.ObjectId(customer_id);

    return this.orderPointModel.find(filter).exec();
  }

  async getById(id: string): Promise<OrderPointEntity> {
    return this.orderPointModel.findById(id).exec();
  }

  async update(
    id: string,
    dto: CreateOrderPointDto,
  ): Promise<OrderPointEntity> {
    const orderPoint = await this.orderPointModel.findById(id).exec();
    if (!orderPoint) {
      throw new NotFoundException(`OrderPoint with ID "${id}" not found`);
    }

    if (dto.order_id) {
      const order = await this.ordersService.getById(
        new Types.ObjectId(dto.order_id),
      );
      if (!order) {
        throw new NotFoundException(
          `Order with ID "${dto.order_id}" not found`,
        );
      }
    }

    if (dto.customer_id) {
      const customer = await this.customersService.getById(
        new Types.ObjectId(dto.customer_id),
      );
      if (!customer) {
        throw new NotFoundException(
          `Customer with ID "${dto.customer_id}" not found`,
        );
      }
    }

    return await this.orderPointModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );
  }

  async delete(id: string): Promise<OrderPointEntity> {
    return await this.orderPointModel.findByIdAndUpdate(
      id,
      {
        $set: {
          deleted: true,
          deletedAt: new Date(),
        },
      },
      { new: true },
    );
  }
}
