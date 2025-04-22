import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID} from "class-validator";
import { EventLocationTypeEnum } from "../entities/event.entity";

export class CreateEventDto{
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    description: string

    @IsNumber()
    @IsNotEmpty()
    duration: number

    @IsEnum(EventLocationTypeEnum)
    @IsNotEmpty()
    locationType: EventLocationTypeEnum
}

export class EventIdDto{
    @IsUUID(4, { message: "Not a valid UUID, Enter a correct one!"})
    @IsNotEmpty()
    eventId: string
}

export class UsernameDto{
    @IsString()
    @IsNotEmpty()
    username: string
}

export class UsernameAndSlugDto{
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    slug: string
}