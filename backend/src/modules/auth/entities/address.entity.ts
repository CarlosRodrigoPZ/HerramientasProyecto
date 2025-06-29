import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Address {
  @Prop({ required: true }) street: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) state: string;
  @Prop({ required: true }) postalCode: string;
  @Prop({ required: true }) country: string;
}
