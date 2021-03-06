import { NotFoundException } from '@nestjs/common';
import { Resolver, Query,  Args, Mutation} from '@nestjs/graphql';
import { Doctor, AddDoctorInput } from './doctors.model';
import { DoctorsService } from './doctors.service';


@Resolver(of => [Doctor])
export class DoctorsResolver {
  constructor(private service: DoctorsService) {}

  @Query(() => [Doctor])
  async getAllDoctors(): Promise<Doctor[] | Error> {
    return await this.service.findAll();
  }

  @Query(() => Doctor)
  async getDoctor(@Args('doctorId') doctorId: string): Promise<Doctor | NotFoundException> {

    return await this.service.findOne(doctorId);

  }

  @Mutation(() => Doctor)
  async addDoctor(@Args('input') addDoctorInput: AddDoctorInput
  ): Promise<Doctor | NotFoundException> {
    try {
      const doctor = await this.service.create(addDoctorInput);
      return doctor
    } catch (err) {
      throw new NotFoundException('Doctor not created!');
    }
  }

  @Mutation(() => Doctor)
  async removeDoctor(@Args('doctorId') doctorId: string): Promise<Doctor | NotFoundException> {

    return await this.service.remove(doctorId);

  }
  
}
