
import { Date, Document } from 'mongoose';

export interface IAvailability extends Document {
  readonly _id?: string;
  readonly doctorId: string;
  readonly date: Date;
  readonly fromTime: string;
  readonly toTime: string;
  readonly timeslots: string;
  readonly tz: string;
}
