import { HTTPSTATUS } from "../config/http.config";
import {
  CreateEventDto,
  EventIdDto,
  UsernameAndSlugDto,
  UsernameDto,
} from "../databases/dto/event.dto";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { asyncHandlerAndValidation } from "../middlewares/withValidation.middleware";
import {
  createEventService,
  deleteEventService,
  getPublicEventsByUsernameAndSlugService,
  getPublicEventsFromUsernameService,
  getUserEventsService,
  toggleEventPrivacyService,
} from "../services/event.service";
import { Request, Response } from "express";

export const createEventController = asyncHandlerAndValidation(
  CreateEventDto,
  "body",
  async (req: Request, res: Response, createEventDto) => {
    const userId = req.user?.id as string;
    const event = await createEventService(userId, createEventDto);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Event created Successfully",
      event,
    });
  }
);

export const getUserEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const { username, events } = await getUserEventsService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched user events successfully",
      data: {
        events,
        username,
      },
    });
  }
);

export const toggleEventPrivacyController = asyncHandlerAndValidation(
  EventIdDto,
  "body",
  async (req: Request, res: Response, eventIdDto) => {
    const userId = req.user?.id as string;

    const event = await toggleEventPrivacyService(userId, eventIdDto.eventId);

    return res.status(HTTPSTATUS.OK).json({
      message: `Event set to ${
        event.isPrivate ? "private" : "public"
      } successfully`,
    });
  }
);

export const getPublicEventsByUsernameController = asyncHandlerAndValidation(
  UsernameDto,
  "params",
  async (req: Request, res: Response, usernameDto) => {
    const { user, events } = await getPublicEventsFromUsernameService(
      usernameDto.username
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Fetched user and their events successfully",
      user,
      events,
    });
  }
);

export const getPublicEventsByUsernameAndSlugController =
  asyncHandlerAndValidation(
    UsernameAndSlugDto,
    "params",
    async (req: Request, res: Response, usernameAndSlugDto) => {
      const event = await getPublicEventsByUsernameAndSlugService(
        usernameAndSlugDto
      );

      return res.status(HTTPSTATUS.OK).json({
        message: `Event Details Fetched successfully`,
        event
      });
    }
  );

export const deleteEventController = asyncHandlerAndValidation(
  EventIdDto,
  "params",
  async (req: Request, res: Response, eventIdDto) => {
    const userId = req.user?.id as string;

    await deleteEventService(userId, eventIdDto.eventId);

    return res.status(HTTPSTATUS.OK).json({
      message: `Deleted the event of the user ${userId} successfully`,
    });
  }
);
