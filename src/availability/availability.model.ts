import { Field, Int, ObjectType, InputType } from '@nestjs/graphql';
import { Date } from 'mongoose';
import {
  MaxLength,
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  IsMilitaryTime,
  Max,
} from 'class-validator';


@ObjectType()
export class Availability {
  @Field()
  readonly _id?: string;

  @Field()
  readonly doctorId: string;

  @Field(() => Date)
  readonly date: Date;

  @Field()
  readonly fromTime: string;

  @Field()
  readonly toTime: string;

  @Field()
  readonly timeslots: string;

  @Field()
  readonly tz: string;

}

@InputType()
export class TimeSlot {

  @IsMilitaryTime()
  @IsNotEmpty()
  @Field()
  readonly fromTime: string;

  @IsMilitaryTime()
  @IsNotEmpty()
  @Field()
  readonly toTime: string;

}


@InputType()
export class CreateAvailabilityInput {

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @Field()
  doctorId: string;

  @IsDate()
  @IsOptional()
  @Field()
  date: string;

  @IsArray()
  @MaxLength(10)
  @IsNotEmpty()
  @Field(() => [TimeSlot])
  timeslots: TimeSlot[];

}


@ObjectType()
export class AllAvailability {

  @Field()
  readonly doctorId: string;

  @Field(() => Date)
  readonly date: Date;

  @Field()
  readonly fromTime: string;

  @Field()
  readonly toTime: string;

}


@InputType()
export class FindAvailabilityInput {
  
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @Field()
  doctorId: string;

  @IsDate()
  @IsNotEmpty()
  @Field()
  fromDate: string;

  @IsDate()
  @IsNotEmpty()
  @Field()
  toDate: string;

  @IsInt()
  @IsNotEmpty()
  @Field(() => Int)
  duration: number;


}