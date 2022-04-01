import { Date, Document } from 'mongoose';

export interface IDoctor extends Document {
  readonly _id?: string;
  readonly fullName: string;
  readonly age: number;
  readonly sex: string;
  readonly specialization: string;
}
