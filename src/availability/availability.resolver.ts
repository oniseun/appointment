import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Resolver, Query,  Args, Mutation} from '@nestjs/graphql';
import { Availability, CreateAvailabilityInput, AllAvailability, FindAvailabilityInput } from './availability.model';
import { AvailabilityService } from './availability.service';


@Resolver(of => [Availability])
export class AvailabilityResolver {
  constructor(private service: AvailabilityService) {}

  @Query(returns => [AllAvailability])
  async findAvailability(@Args('input') findAvailabilityInput: FindAvailabilityInput): Promise<AllAvailability[] | Error> {
    return await this.service.findAll(findAvailabilityInput);
  }


  @Mutation(returns => Availability)
  async createAvailability(@Args('input') createAvailabilityInput: CreateAvailabilityInput
  ): Promise<Availability | NotFoundException> {
    try {
      return await this.service.create(createAvailabilityInput);
    } catch (err) {
      console.error(err)
      throw new BadRequestException('Availability could not be created!', JSON.stringify(err));
    }
  }

}
