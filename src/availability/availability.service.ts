import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IAvailability } from './interfaces/availability.interface';
import { CreateAvailabilityInput, AllAvailability, FindAvailabilityInput } from './availability.model';
import { Availability } from './schemas/availability.schema';
import { getAvailableTimeslots, createTimeSlots } from '../common/utils/timeEngine';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { Doctor } from 'src/doctors/schemas/doctor.schema';
import { IDoctor } from 'src/doctors/interfaces/doctor.interface';
import { validateTimeSlotInput } from 'src/common/utils/timeValidator';
const STEPS = 15;
const MAX_MINUTES = 45
@Injectable()
export class AvailabilityService {
  constructor(
    private env: ConfigService,
    @InjectModel(Availability.name) private availabilityModel: Model<IAvailability>,
    @InjectModel(Doctor.name) private readonly doctorModel: Model<IDoctor>,
  ){}

  public async findAll(
    findAvailabilityInput: FindAvailabilityInput
  ): Promise<AllAvailability[]> {
  const { doctorId, fromDate, toDate, duration } = findAvailabilityInput

  if (!DateTime.fromISO(fromDate).isValid || !DateTime.fromISO(toDate).isValid){
     throw new BadRequestException("Invalid date suplied")
  }
  if (DateTime.fromISO(toDate).toMillis() < DateTime.fromISO(fromDate).toMillis()) {
    throw new BadRequestException("toDate cannot be less than fromDate")
  }
  if (DateTime.fromISO(toDate).toMillis() < DateTime.now().toMillis() || DateTime.fromISO(fromDate).toMillis() < DateTime.now().toMillis() ){
    throw new BadRequestException("Date cannot be in the past")
  }

  if (duration % STEPS !== 0 || duration < STEPS || duration > 45) {
    throw new BadRequestException(`duration must be at ${STEPS} minutes interval and not more than ${MAX_MINUTES} minutes`)
  }

  const doctor = await this.doctorModel.findById({ _id: doctorId }).exec();

  if (!doctor) {
      throw new NotFoundException(`Doctor #${doctorId} does not exist`);
  }

  const availabilities = await this.availabilityModel
    .find({
    doctorId,
    date: {
      $gte: new Date(fromDate), 
      $lte: new Date(toDate)
    }, 
  } as unknown)
    .exec();

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
  ): Promise<IAvailability> {
    const tz = this.env.get('DEFAULT_TZ')
    const { doctorId, date, timeslots } = createAvailabilityInput;


    if (!DateTime.fromISO(date).isValid){
      throw new BadRequestException("Invalid date suplied")
    }
    if (DateTime.fromISO(date).toMillis() < DateTime.now().toMillis() ){
      throw new BadRequestException("Date cannot be in the past")
    }
    const doctor = await this.doctorModel.findById({ _id: doctorId }).exec();

    if (!doctor) {
        throw new NotFoundException(`Doctor #${doctorId} does not exist`);
    }

    const availability = await this.availabilityModel.findOne({ doctorId, date: (new Date(date)) } as unknown).exec();

    if (availability) {
        throw new BadRequestException(`Availability already exist for this Doctor #${doctorId} and date #${date}`);
    }


    validateTimeSlotInput(timeslots);// will throw an error if it fails

    const timeSlotObj = createTimeSlots(timeslots, STEPS)
    const timeSlotKeys = Object.keys(timeSlotObj)
    const fromTime = timeSlotKeys[0]
    const toTime = timeSlotKeys[timeSlotKeys.length - 1]

    const insert = { doctorId, date: new Date(date), fromTime, toTime, timeslots: JSON.stringify(timeSlotObj), tz  }
    return await this.availabilityModel.create(insert);
  }

}
