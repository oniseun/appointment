import { Field, Int, ObjectType, PartialType, InputType } from '@nestjs/graphql';

import {
  MaxLength,
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';
import { isRequiredArgument } from 'graphql';


@ObjectType()
export class Doctor {
  @Field()
  readonly _id?: string;

  @Field()
  readonly fullName: string;

  @Field(() => Int)
  readonly age: number;

  @Field()
  readonly specialization: string;
}



@InputType()
export class AddDoctorInput {

  @IsString()
  @MaxLength(30)
  @MinLength(5)
  @IsNotEmpty()
  @Field()
  fullName: string;


  @IsInt()
  @MaxLength(2)
  @IsNotEmpty()
  @Field(() => Int)
  age: number;

  @IsString()
  @MaxLength(30)
  @MinLength(5)
  @IsNotEmpty()
  @Field()
  specialization: string;
}


@InputType()
export class UpdateDoctorInput extends PartialType(AddDoctorInput) {}