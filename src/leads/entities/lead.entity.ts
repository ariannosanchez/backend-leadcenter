import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Lead extends Document {

  @Prop({ required: true })  
  firstName: string;

  @Prop({ required: true, unique: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  phone: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
