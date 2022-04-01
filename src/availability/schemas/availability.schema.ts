import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Types } from 'mongoose';

const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
@Schema({
  autoIndex: true,
})
export class Availability extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: string;

  @Prop({ type: Date, required: true})
  date: Date;

  @Prop({ required: true})
  fromTime: string;

  @Prop({ required: true})
  toTime: string;

  @Prop({ required: true})
  timeslots: string;

  @Prop({ required: true, default: defaultTz})
  tz: string;

}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability).index({ doctorId: 1, date: 1}, {unique: true});

