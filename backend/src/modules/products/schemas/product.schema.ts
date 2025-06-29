import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  brand: string;

  @Prop()
  category: string;

  @Prop()
  price: number;

  @Prop()
  rating: number;

  @Prop()
  reviews: number;

  @Prop()
  material: string;

  @Prop()
  type: string;

  @Prop()
  image: string;

  @Prop({ default: false })
  isDisabled: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
