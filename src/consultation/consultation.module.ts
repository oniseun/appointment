import { Module } from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultationSchema, Consultation } from './schemas/consultation.schema';
import { ConsultationResolver } from './consultation.resolver';
import { Availability, AvailabilitySchema } from '../availability/schemas/availability.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Consultation.name, schema: ConsultationSchema },
      { name: Availability.name, schema: AvailabilitySchema },
    ]),
  ],
  providers: [ConsultationService, ConsultationResolver]
})
export class ConsultationModule {}
