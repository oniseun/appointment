import { Field, Int, ObjectType, PartialType, InputType } from '@nestjs/graphql';

import {
  MaxLength,
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';


@ObjectType()
export class Doctor {
  @Field()
  readonly _id?: string;

  @Field()
  readonly fullName: string;

  @Field(() => Int)
  readonly age: number;

  @Field()
  readonly sex: string;

  @Field()
  readonly specialization: string;
}



@InputType()
export class AddDoctorInput {

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @Field()
  fullName: string;


  @IsInt()
  @MaxLength(2)
  @IsOptional()
  @Field(() => Int)
  age: number;

  @IsEnum({ M: "M", F: "F"})
  @MaxLength(1)
  @IsNotEmpty()
  @Field()
  sex: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @Field()
  specialization: string;
}


@InputType()
export class UpdateDoctorInput extends PartialType(AddDoctorInput) {}