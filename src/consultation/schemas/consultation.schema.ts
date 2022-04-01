import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Types } from 'mongoose';


@Schema()
export class Consultation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Doctor' })
  doctorId: string;

  @Prop({ unique: true })
  consultationId: string;

  @Prop()
  patientName: string;

  @Prop({ type: Date})
  date: Date;

  @Prop({ type: Date})
  fromDateTime: Date;

  @Prop({ type: Date})
  toDateTime: Date;
  
  @Prop()
  fromTime: string;

  @Prop()
  toTime: string;


  @Prop()
  tz: string;

}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);

