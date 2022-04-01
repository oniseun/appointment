import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Types } from 'mongoose';


@Schema()
export class Availability extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Doctor' })
  doctorId: string;

  @Prop({ type: Date})
  date: Date;

  @Prop()
  fromTime: string;

  @Prop()
  toTime: string;

  @Prop()
  timeslots: string;

  @Prop()
  tz: string;

}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability).index({ doctorId: 1, date: 1, fromHour: 1, fromMin: 1, toHour:1, toMin:1});

