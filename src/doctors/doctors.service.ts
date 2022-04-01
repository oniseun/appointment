import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IDoctor } from './interfaces/doctor.interface';
import { AddDoctorInput } from './doctors.model';
import { Doctor } from './schemas/doctor.schema';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private readonly doctorModel: Model<IDoctor>,
  ) {}

  public async findAll(
  ): Promise<IDoctor[]> {

    return await this.doctorModel.find().exec();
  }

  public async findOne(doctorId: string): Promise<IDoctor | NotFoundException> {
    const doctor = await this.doctorModel.findById({ _id: doctorId }).exec();

    if (!doctor) {
      throw new NotFoundException(`Doctor #${doctorId} not found`);
    }

    return doctor;
  }

  public async create(
    addDoctorInput: AddDoctorInput,
  ): Promise<IDoctor | BadRequestException> {
    const createDoctor = await this.doctorModel.create(addDoctorInput);
    if (!createDoctor) {
      throw new BadRequestException(`Error creating new doctor`);
    }
    return createDoctor
  }

  public async remove(doctorId: string): Promise<IDoctor> {
    const removeDoctor = await this.doctorModel.findByIdAndRemove(
      doctorId
    );

    if (!removeDoctor) {
      throw new BadRequestException(`Doctor does not exist`);
    }
    return removeDoctor
  }
  
}
