import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args, Mutation} from '@nestjs/graphql';
import { ConsultationDetail, BookConsultationInput, GetConsultationsInput } from './consultation.model';
import { ConsultationService } from './consultation.service';


@Resolver(of => [ConsultationDetail])
export class ConsultationResolver {
  constructor(private service: ConsultationService) {}

  @Mutation(returns => ConsultationDetail)
  async bookConsultation(@Args('input') bookConsultationInput: BookConsultationInput): Promise<ConsultationDetail | Error> {
    try {
      return await this.service.create(bookConsultationInput);
    } catch (err) {
      console.error(err)
      throw new BadRequestException('Consultation could not be booked!', JSON.stringify(err));
    }
  }


  @Query(returns => [ConsultationDetail])
  async getConsultations(@Args('input') getConsultationsInput: GetConsultationsInput
  ): Promise<ConsultationDetail[] | NotFoundException> {
    try {
      return await this.service.findAll(getConsultationsInput);
    } catch (err) {
      console.error(err)
      throw new NotFoundException('No Consultations found!', JSON.stringify(err));
    }
  }

  @Query(returns => ConsultationDetail)
  async getConsultation(@Args('consultationId') consultationId: string
  ): Promise<ConsultationDetail | NotFoundException> {
    try {
      return await this.service.findOne(consultationId);
    } catch (err) {
      console.error(err)
      throw new NotFoundException('Consultation could not be found!', JSON.stringify(err));
    }
  }

}
