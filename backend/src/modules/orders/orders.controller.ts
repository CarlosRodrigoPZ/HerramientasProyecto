// src/modules/orders/orders.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    _id: string;
  };
}

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user ? req.user._id : null;
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get('me')
  getMyOrders(@Request() req: RequestWithUser) {
    return this.ordersService.findByUser(req.user._id);
  }

  @Get()
  getAllOrders() {
    return this.ordersService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/pay')
  async payOrder(@Param('id') orderId: string) {
    return this.ordersService.payOrder(orderId);
  }
}
