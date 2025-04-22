import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { dayOfWeekEnum } from "../entities/day-availability";

export class DayAvailabilityDto {
  @IsEnum(dayOfWeekEnum)
  @IsNotEmpty()
  day: dayOfWeekEnum;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;
}

export class UpdateAvailabilityDto {
  @IsNumber()
  @IsNotEmpty()
  timeGap: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DayAvailabilityDto)
  days: DayAvailabilityDto[];
}
