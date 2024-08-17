import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult, Types } from 'mongoose';
import { OrderPointEntity } from '../schema/order_point.schema';
import { CreateOrderPointDto } from '../dto/create-order_point.dto';
import { OrdersService } from 'src/module/orders/service/orders.service';
import { CustomersService } from 'src/module/customers/service/customers.service';
import { OrderPointDetailsService } from 'src/module/order_points_details/service/order-point-details.service';
import { UserService } from 'src/module/users/service/users.service';
import { ProductsService } from 'src/module/products/service/products.service';

@Injectable()
export class OrderPointsService {
  constructor(
    @InjectModel(OrderPointEntity.name)
    private readonly orderPointModel: PaginateModel<OrderPointEntity>,
    private readonly ordersService: OrdersService,
    private readonly customersService: CustomersService,
    private readonly usersService: UserService, // Tambahkan usersService
    private readonly orderPointDetailsService: OrderPointDetailsService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
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

    const user = await this.usersService.getUser(dto.user_id);
    if (!user) {
      throw new NotFoundException(`User with ID "${dto.user_id}" not found`);
    }

    const product = await this.productsService.getById(
      new Types.ObjectId(dto.product_id),
    );
    if (!product) {
      throw new NotFoundException(
        `Product with ID "${dto.product_id}" not found`,
      );
    }

    // Hitung total secara otomatis
    const calculatedTotal = dto.qty * product.sell_price;
    const calculatedChange = dto.pay - calculatedTotal;

    const newOrderPoint = new this.orderPointModel({
      order_id: new Types.ObjectId(dto.order_id),
      customer_id: new Types.ObjectId(dto.customer_id),
      user_id: new Types.ObjectId(dto.user_id),
      total: calculatedTotal,
      pay: dto.pay,
      qty: dto.qty,
      change: calculatedChange,
      note: dto.note,
      total_points_earned: dto.total_points_earned,
    });

    const savedOrderPoint = await newOrderPoint.save();

    await this.orderPointDetailsService.create({
      order_point_id: new Types.ObjectId(savedOrderPoint._id as string),
      product_id: new Types.ObjectId(dto.product_id),
      buy: product.buy_price, // Gunakan harga beli produk
      qty: dto.qty,
      price: product.sell_price,
      amount: dto.qty * product.sell_price,
    });

    return savedOrderPoint;
  }

  async get(): Promise<PaginateResult<OrderPointEntity>> {
    const options = {
      limit: 10,
      sort: { createdAt: -1 },
    };
    return this.orderPointModel.paginate({}, options);
  }

  async getById(id: string): Promise<OrderPointEntity> {
    const orderPoint = await this.orderPointModel.findById(id).exec();
    if (!orderPoint) {
      throw new NotFoundException(`OrderPoint with ID "${id}" not found`);
    }

    return orderPoint;
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

    if (dto.user_id) {
      const user = await this.usersService.getUser(dto.user_id);
      if (!user) {
        throw new NotFoundException(`User with ID "${dto.user_id}" not found`);
      }
    }

    let updatedTotal = orderPoint.total;
    let updatedChange = orderPoint.change;

    if (dto.qty || dto.product_id) {
      const product = await this.productsService.getById(
        new Types.ObjectId(dto.product_id),
      );
      if (!product) {
        throw new NotFoundException(
          `Product with ID "${dto.product_id}" not found`,
        );
      }

      updatedTotal = dto.qty * product.sell_price;
      updatedChange = dto.pay ? dto.pay - updatedTotal : updatedChange;
    }

    return await this.orderPointModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...dto,
          order_id: new Types.ObjectId(dto.order_id),
          customer_id: new Types.ObjectId(dto.customer_id),
          user_id: new Types.ObjectId(dto.user_id),
          total: updatedTotal,
          change: updatedChange,
        },
      },
      { new: true },
    );
  }

  async delete(id: string): Promise<OrderPointEntity> {
    const orderPoint = await this.orderPointModel.findById(id).exec();
    if (!orderPoint) {
      throw new NotFoundException(`OrderPoint with ID "${id}" not found`);
    }

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
