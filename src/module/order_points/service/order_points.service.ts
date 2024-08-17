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

    const user = await this.usersService.getUser(dto.user_id); // Verifikasi user_id
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

    // Hitung change sebagai pay - total
    const calculatedChange = dto.pay - dto.total;

    const newOrderPoint = new this.orderPointModel({
      order_id: new Types.ObjectId(dto.order_id),
      customer_id: new Types.ObjectId(dto.customer_id),
      user_id: new Types.ObjectId(dto.user_id),
      total: dto.total,
      pay: dto.pay,
      change: calculatedChange, // Set nilai change yang telah dihitung
      note: dto.note,
      total_points_earned: dto.total_points_earned,
    });

    const savedOrderPoint = await newOrderPoint.save();

    // Create order point details automatically
    await this.orderPointDetailsService.create({
      order_point_id: savedOrderPoint._id as Types.ObjectId,
      product_id: new Types.ObjectId(dto.product_id),
      points_earned: product.loyalty_points,
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

    // Hitung ulang change jika ada update pada pay atau total
    const updatedChange = dto.pay ? dto.pay - dto.total : orderPoint.change;

    return await this.orderPointModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...dto,
          order_id: new Types.ObjectId(dto.order_id),
          customer_id: new Types.ObjectId(dto.customer_id),
          user_id: new Types.ObjectId(dto.user_id),
          change: updatedChange, // Set nilai change yang telah diperbarui
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
