import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateResult, Types, PaginateModel } from 'mongoose';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderEntity } from '../schema/order.schema';
import { CustomersService } from 'src/module/customers/service/customers.service';
import { UserService } from 'src/module/users/service/users.service';
import { PaymentMethodsService } from 'src/module/payment-methods/service/payment-methods.service';
import { OrderDetailsService } from 'src/module/order_details/service/order-details.service';
import { ProductsService } from 'src/module/products/service/products.service';
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(OrderEntity.name)
    private readonly orderModel: PaginateModel<OrderEntity>,
    private readonly customersService: CustomersService,
    private readonly userService: UserService,
    private readonly paymentMethodsService: PaymentMethodsService,
    @Inject(forwardRef(() => OrderDetailsService))
    private readonly orderDetailsService: OrderDetailsService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderEntity> {
    const customer = await this.customersService.getById(
      new Types.ObjectId(dto.customer_id),
    );
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID "${dto.customer_id}" not found`,
      );
    }

    const user = await this.userService.getUser(dto.user_id);
    if (!user) {
      throw new NotFoundException(`User with ID "${dto.user_id}" not found`);
    }

    const payment_method = await this.paymentMethodsService.getById(
      dto.payment_method_id,
    );
    if (!payment_method) {
      throw new NotFoundException(
        `Payment method with ID "${dto.payment_method_id}" not found`,
      );
    }

    const product = await this.productsService.getById(
      new Types.ObjectId(dto.product_id),
    );
    if (!product) {
      throw new NotFoundException(
        `Product with ID "${dto.product_id}" not found`,
      );
    }

    const newOrder = new this.orderModel({
      customer_id: new Types.ObjectId(dto.customer_id),
      user_id: new Types.ObjectId(dto.user_id),
      payment_method_id: new Types.ObjectId(dto.payment_method_id),
      product_id: new Types.ObjectId(dto.product_id),
      proof_payment: dto.proof_payment,
      get_point: dto.get_point || 0,
      total: dto.total,
      pay: dto.pay,
      change: dto.change || dto.pay - dto.total,
      note: dto.note,
    });

    const savedOrder = (await newOrder.save()) as OrderEntity & {
      _id: Types.ObjectId;
    };

    //Create order details automatically
    await this.orderDetailsService.create({
      order_id: savedOrder._id, // Use order_id instead of orderId
      product_id: dto.product_id as Types.ObjectId, // Use product_id
      qty: product.quantity, // Use qty
      price: product.sell_price, // Use price
      disc: product.discount || 0, // Use disc
    });

    return savedOrder;
  }

  async approveOrder(orderId: Types.ObjectId): Promise<OrderEntity> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order.save();
  }

  async cancelOrder(orderId: Types.ObjectId): Promise<OrderEntity> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order.save();
  }

  async get(): Promise<PaginateResult<OrderEntity>> {
    const options = {
      limit: 10,
      sort: {
        cdate: -1,
      },
    };

    return this.orderModel.paginate({}, options);
  }

  async getById(orderId: Types.ObjectId): Promise<OrderEntity | null> {
    return this.orderModel.findById(orderId).exec();
  }

  async update(
    orderId: Types.ObjectId,
    dto: CreateOrderDto,
  ): Promise<OrderEntity> {
    const order = await this.orderModel.findById(orderId).lean();
    if (!order) {
      throw new NotFoundException('Order not found');
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

    if (dto.user_id) {
      const user = await this.userService.getUser(dto.user_id);
      if (!user) {
        throw new NotFoundException(`User with ID "${dto.user_id}" not found`);
      }
    }

    if (dto.payment_method_id) {
      const payment_method = await this.paymentMethodsService.getById(
        dto.payment_method_id,
      );
      if (!payment_method) {
        throw new NotFoundException(
          `Payment method with ID "${dto.payment_method_id}" not found`,
        );
      }
    }

    return await this.orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: dto },
      { new: true },
    );
  }

  async delete(orderId: Types.ObjectId) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order.deleteOne();
  }
}
