import { Module } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailabilitySchema, Availability } from './schemas/availability.schema';
import { AvailabilityResolver } from './availability.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Availability.name, schema: AvailabilitySchema },
    ]),
  ],
  providers: [AvailabilityService, AvailabilityResolver],
})
export class AvailabilityModule {}
