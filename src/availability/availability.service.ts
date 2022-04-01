import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IAvailability } from './interfaces/availability.interface';
import { CreateAvailabilityInput, AllAvailability, FindAvailabilityInput } from './availability.model';
import { Availability } from './schemas/availability.schema';
import { getAvailableTimeslots, createTimeSlots, createTimeSlot } from '../common/utils/transformer';
import { ConfigService } from '@nestjs/config';
const STEPS = 15;

@Injectable()
export class AvailabilityService {
  constructor(

    private env: ConfigService,
    @InjectModel(Availability.name) private availabilityModel: Model<IAvailability>,
  ){}

  public async findAll(
    findAvailabilityInput: FindAvailabilityInput
  ): Promise<AllAvailability[]> {
  const { doctorId, fromDate, toDate, duration } = findAvailabilityInput
  const availabilities = await this.availabilityModel
    .find({
    doctorId,
    date: {
      $gte: new Date(fromDate), 
      $lte: new Date(toDate)
    }, 
  } as unknown)
    .exec();

  console.log({availabilities})

  const dateTimeSlots =  availabilities.map(item => {
    const { date, timeslots } =  item;

    return getAvailableTimeslots(JSON.parse(timeslots), duration, STEPS).map( ts => {
      return {
        doctorId,
        date,
        ...ts
      }
    })
    
  }).reduce((list, ts) =>  [...list, ...ts],[])
  return  dateTimeSlots;

  }


  public async create(
    createAvailabilityInput: CreateAvailabilityInput,
  ): Promise<IAvailability[]> {
    const tz = this.env.get('DEFAULT_TZ')
    const { doctorId, date, timeslots } = createAvailabilityInput;
    const batchRecords = timeslots.map( ts => {
        const { fromTime, toTime } = ts
        const timeSlotObj = createTimeSlot(fromTime, toTime, STEPS)
        return { doctorId, date: new Date(date), fromTime, toTime, timeslots: JSON.stringify(timeSlotObj), tz  }
    })
    return await this.availabilityModel.insertMany(batchRecords);
  }

}
