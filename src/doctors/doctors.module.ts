import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorSchema, Doctor } from './schemas/doctor.schema';
import { DoctorsResolver } from './doctors.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
    ]),
  ],
  providers: [DoctorsService, DoctorsResolver]
})
export class DoctorsModule {}
