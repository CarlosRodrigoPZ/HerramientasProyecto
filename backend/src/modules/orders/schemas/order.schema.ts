// src/modules/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false, default: null })
  user: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }, // Precio unitario del producto
      subtotal: { type: Number, required: true }, // quantity * price
    },
  ])
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    subtotal: number;
  }[];

  @Prop({ required: true })
  total: number;

  @Prop({ default: 'pending' }) // pending | paid | shipped | cancelled
  status: string;

  @Prop()
  paymentId: string; // Se rellena después del pago (Stripe o PayPal)
}

export const OrderSchema = SchemaFactory.createForClass(Order);
