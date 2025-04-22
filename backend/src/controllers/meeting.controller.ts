import { Request, Response } from "express";
import {
  MeetingFilterENum,
  MeetingFilterEnumType,
} from "../enums/meeting.enum";
import {
  cancelMeetingService,
  createMeetBookingForGuestService,
  getUserMeetingsService,
} from "../services/meeting.service";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { CreateMeetingDto, MeetingDto } from "../databases/dto/meeting.dto";
import { asyncHandlerAndValidation } from "../middlewares/withValidation.middleware";

export const getUserMeetingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const filter =
      (req.query.filter as MeetingFilterEnumType) || MeetingFilterENum.UPCOMING;

    const meetings = await getUserMeetingsService(userId, filter);

    return res.status(HTTPSTATUS.OK).json({
      message: `Fetched User ${userId} meetings successfully`,
      meetings,
    });
  }
);

export const createMeetBookingForGuestController = asyncHandlerAndValidation(
  CreateMeetingDto,
  "body",
  async (req: Request, res: Response, createMeetingDto) => {
    const { meeting, meetLink } = await createMeetBookingForGuestService(
      createMeetingDto
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: `Meeting Scheduled successfully`,
      data: {
        meeting,
        meetLink,
      },
    });
  }
);

export const cancelMeetingController = asyncHandlerAndValidation(
  MeetingDto,
  "params",
  async (req: Request, res: Response, meetingDto) => {
    await cancelMeetingService(meetingDto.meetingId);

    res.status(HTTPSTATUS.OK).json({
      message: `Meeting Cancelled Successfully`,
    });
  }
);
