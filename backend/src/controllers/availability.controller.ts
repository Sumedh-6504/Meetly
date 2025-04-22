import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  getUserAvailabilityForPublicEventsService,
  getUserAvailabilityService,
  updateAvailabilityService,
} from "../services/availability.service";
import { asyncHandlerAndValidation } from "../middlewares/withValidation.middleware";
import { UpdateAvailabilityDto } from "../databases/dto/availability.dto";
import { EventIdDto } from "../databases/dto/event.dto";
// import { getPublicEventsFromUsernameService } from "../services/event.service";

export const getUserAvailabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const availability = await getUserAvailabilityService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched Availability Successfully",
      availability,
    });
  }
);

export const updateAvailabilityController = asyncHandlerAndValidation(
  UpdateAvailabilityDto,
  "body",
  async (req: Request, res: Response, updateAvailabilityDto) => {
    const userId = req.user?.id as string;

    await updateAvailabilityService(userId, updateAvailabilityDto);

    return res.status(HTTPSTATUS.OK).json({
      message: "User Availability Updated",
    });
  }
);

export const getAvailabilityForPublicEventController =
  asyncHandlerAndValidation(
    EventIdDto,
    "params",
    async (req: Request, res: Response, eventIdDto) => {
      const availability = await getUserAvailabilityForPublicEventsService(
        eventIdDto.eventId
      );

      return res.status(HTTPSTATUS.OK).json({
        message: "Event Availability fetched successfully",
        data: availability,
      });
    }
  );
