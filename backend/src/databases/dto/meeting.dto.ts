import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEmail,
  IsOptional,
  IsUUID,
} from "class-validator";

export class CreateMeetingDto {
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @IsDateString()
  @IsNotEmpty()
  startTime:string

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsEmail()
  @IsNotEmpty()
  guestEmail: string;

  @IsString()
  @IsOptional()
  additionalInfo: string;
}

export class MeetingDto {
  @IsUUID(4, { message: `Invaild UUID` })
  @IsNotEmpty()
  meetingId: string;
}
