import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true }) nombre: string;
  @Prop({ required: true }) apellidos: string;
  @Prop({ required: true }) pais: string;
  @Prop({ required: true }) telefono: string;
  @Prop({ required: true, unique: true }) correo: string;
  @Prop({ required: true }) password: string;
  @Prop({ required: true, default: 'user' }) role: string;
  @Prop({ default: false }) isBanned: boolean;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ type: String, default: null }) emailVerificationToken: string | null;

  @Prop({
    type: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  })
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
