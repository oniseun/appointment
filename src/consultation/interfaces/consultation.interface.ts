
import { Date, Document } from 'mongoose';

export interface IConsultation extends Document {
  readonly _id?: string;
  readonly consultationId: string;
  readonly patientName: string;
  readonly doctorId: string;
  readonly date: Date;
  readonly fromDateTime: Date;
  readonly toDateTime: Date;
  readonly fromTime: string;
  readonly toTime: string;
  readonly tz: string;
}

