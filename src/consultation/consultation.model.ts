import { Field,  ObjectType, InputType } from '@nestjs/graphql';
import { Date } from 'mongoose';
import {
  MaxLength,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsMilitaryTime
} from 'class-validator';


@ObjectType()
export class ConsultationDetail {
  @Field()
  readonly _id?: string;

  @Field()
  readonly doctorId: string;

  @Field()
  readonly patientName: string;

  @Field()
  readonly consultationId: string;

  @Field(() => Date)
  readonly date: Date;

  @Field()
  readonly fromTime: string;

  @Field()
  readonly toTime: string;

  @Field()
  readonly tz: string;

}

@InputType()
export class BookConsultationInput {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @Field()
  readonly doctorId: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @Field()
  readonly patientName: string;

  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @Field()
  readonly consultationId: string;

  @IsDate()
  @IsOptional()
  @Field()
  readonly date: string;

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
export class GetConsultationsInput {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  @Field()
  readonly doctorId: string;

  @IsDate()
  @IsOptional()
  @Field()
  readonly date: string;

}
