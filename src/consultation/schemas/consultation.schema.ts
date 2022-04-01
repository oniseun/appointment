import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Types } from 'mongoose';

const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

@Schema()
export class Consultation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: string;

  @Prop({ unique: true, required: true })
  consultationId: string;

  @Prop({ required: true })
  patientName: string;

  @Prop({ type: Date, required: true})
  date: Date;

  @Prop({ type: Date})
  fromDateTime: Date;

  @Prop({ type: Date })
  toDateTime: Date;
  
  @Prop({ required: true})
  fromTime: string;

  @Prop({ required: true})
  toTime: string;


  @Prop({ required: true, default: defaultTz})
  tz: string;

}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);

