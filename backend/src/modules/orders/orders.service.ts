// src/modules/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { UserDocument } from '../auth/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}

  async create(userId: string | null, dto: CreateOrderDto): Promise<Order> {
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!user.emailVerified) {
      throw new Error(
        'Debe verificar su correo electrónico para realizar compras',
      );
    }

    let total = 0;

    const itemsWithDetails = await Promise.all(
      dto.items.map(async (item) => {
        const product = await this.productModel.findById(item.product);
        if (!product) {
          throw new NotFoundException(
            `Producto con ID ${item.product} no existe`,
          );
        }

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
          subtotal,
        };
      }),
    );

    const newOrder = new this.orderModel({
      user: userId,
      items: itemsWithDetails,
      total,
      createdAt: new Date(),
      // Save address fields
      address: {
        street: dto.street,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        country: dto.country,
      },
    });

    return newOrder.save();
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderModel.find({ user: userId }).populate('items.product');
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('user').populate('items.product');
  }

  async updateStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );
    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }
    return order;
  }

  async payOrder(orderId: string): Promise<Order> {
    const paymentId = 'simulated_payment_' + Date.now();

    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: 'paid', paymentId },
      { new: true },
    );

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    return order;
  }
}
