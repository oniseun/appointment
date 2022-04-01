import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IConsultation } from './interfaces/consultation.interface';
import { BookConsultationInput, GetConsultationsInput } from './consultation.model';
import { Consultation } from './schemas/consultation.schema';
import { getAvailableTimeslots, bookTimeSlot } from '../common/utils/timeEngine';
import { Availability } from 'src/availability/schemas/availability.schema';
import { IAvailability } from 'src/availability/interfaces/availability.interface';
import { ConfigService } from '@nestjs/config';
import { DateTime, Interval } from 'luxon';

const STEPS = 15;
@Injectable()
export class ConsultationService {
  constructor(
    private env: ConfigService,
    @InjectModel(Consultation.name) private consultationModel: Model<IConsultation>,
    @InjectModel(Availability.name) private availabilityModel: Model<IAvailability>,
  ){}

  public async findAll( getConsultationsInput: GetConsultationsInput): Promise<IConsultation[]> {
    const { doctorId, date } = getConsultationsInput

    const consultations = await this.consultationModel
    .find({
      doctorId,
      date: new Date(date), 
    } as unknown)
    .exec();

    return consultations
  }

  public async findOne(consultationId: string): Promise<IConsultation> {

    const consultation = await this.consultationModel
    .findOne({
      consultationId 
    })
    .exec();

    if (!consultation) {
      throw new NotFoundException(`Consultation not found for Id: ${consultationId}`);
    }

    return consultation
  }

  public async create(bookConsultationInput: BookConsultationInput): Promise<IConsultation> {
    const { date, doctorId, fromTime, toTime} = bookConsultationInput;
    const tz = this.env.get('DEFAULT_TZ')
    DateTime.local().setZone(tz);
    const offset = DateTime.local().toFormat('ZZZ')
    const [frmTimeObj, toTimeObj] = [DateTime.fromISO(`${date}T${fromTime}${offset}`, { setZone: true }), DateTime.fromISO(`${date}T${toTime}${offset}`,{ setZone: true })]
    const intv = Interval.fromDateTimes(frmTimeObj, toTimeObj);
    const duration = intv.length('minutes')
    const [fromDateTime, toDateTime] = [frmTimeObj, toTimeObj]

    const availability = await this.availabilityModel
    .findOne({
      doctorId,
      date: new Date(date)
    } as unknown)
    .exec();

    if (!availability) {
      throw new NotFoundException(`Availability not not found for date: ${date}`);
    }

    const { timeslots } = availability;
  
    const availableTimeSlots = getAvailableTimeslots(JSON.parse(timeslots), duration, STEPS);
    const find = availableTimeSlots.find((ts) => ts.fromTime === fromTime && ts.toTime === toTime); 

    if (!find) {
      throw new BadRequestException(`Timeslot not available for doctor on date ${date}: ${doctorId}`);
    }
    const createPayload = {...bookConsultationInput, tz, fromDateTime, toDateTime }
    const newConsultation = await this.consultationModel.create(createPayload);
    const updatedTimeSlot = bookTimeSlot(fromTime, toTime, JSON.parse(timeslots), STEPS)
    await this.availabilityModel.findByIdAndUpdate({ _id: availability._id, doctorId, date },
      { timeslots: JSON.stringify(updatedTimeSlot) },
    );
    return newConsultation

    
  }
  
}
