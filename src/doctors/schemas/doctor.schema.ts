import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Doctor extends Document {
  @Prop({ unique: true})
  fullName: string;

  @Prop()
  age: number;

  @Prop()
  sex: string;

  @Prop()
  specialization: string;

  // @Prop({ type: [Types.ObjectId], ref: 'Organization' })
  // organizations: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
