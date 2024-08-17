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

    const product = await this.productsService.findByBatchCode(dto.batch_code);
    if (!product) {
      throw new NotFoundException(
        `Product with batch code "${dto.batch_code}" not found`,
      );
    }

    if (product.stock < dto.qty) {
      throw new Error(
        `Insufficient stock. Available: ${product.stock}, Requested: ${dto.qty}`,
      );
    }

    const total = dto.qty * product.sell_price;

    if (dto.pay < total) {
      throw new Error(
        `Insufficient payment. Total: ${total}, Paid: ${dto.pay}`,
      );
    }
    const change = dto.pay - total;

    const newOrder = new this.orderModel({
      customer_id: new Types.ObjectId(dto.customer_id),
      user_id: new Types.ObjectId(dto.user_id),
      payment_method_id: new Types.ObjectId(dto.payment_method_id),
      product_id: product._id, // Use the product_id retrieved via batch_code
      proof_payment: dto.proof_payment,
      buy_price: product.buy_price * dto.qty,
      qty: dto.qty,
      total: total,
      pay: dto.pay,
      change: change,
      note: dto.note,
    });

    const savedOrder = (await newOrder.save()) as OrderEntity & {
      _id: Types.ObjectId;
    };

    const updatedStock = product.stock - dto.qty;
    await this.productsService.updateStock(
      product._id as Types.ObjectId, // Use product._id directly
      updatedStock,
    );

    await this.orderDetailsService.create({
      order_id: savedOrder._id,
      product_id: product._id as Types.ObjectId,
      qty: dto.qty,
      price: product.sell_price,
      disc: product.discount || 0,
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
