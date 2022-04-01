import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailabilitySchema, Availability } from './schemas/availability.schema';
import { AvailabilityResolver } from './availability.resolver';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
      { name: Doctor.name, schema: DoctorSchema },
    ]),
  ],
  providers: [AvailabilityService, AvailabilityResolver],
})
export class AvailabilityModule {}
