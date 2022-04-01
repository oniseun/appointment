import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Doctor extends Document {
  @Prop({ unique: true, required: true})
  fullName: string;

  @Prop({ required: true})
  age: number;

  @Prop({ required: true })
  specialization: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
