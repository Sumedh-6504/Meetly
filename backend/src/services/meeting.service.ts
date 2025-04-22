import { LessThan, MoreThan } from "typeorm";
import { AppDataSource } from "../config/database.config";
import { Meeting, MeetingStatus } from "../databases/entities/meeting.entity";
import {
  MeetingFilterENum,
  MeetingFilterEnumType,
} from "../enums/meeting.enum";
import { CreateMeetingDto } from "../databases/dto/meeting.dto";
import {
  Integration,
  IntegrationAppTypeEnum,
} from "../databases/entities/integration.entity";

import { BadRequestException, NotFoundException } from "../utils/app-error";
import {
  Event,
  EventLocationTypeEnum,
} from "../databases/entities/event.entity";

import { googleOAuth2Client } from "../config/outh.config";
import { google } from "googleapis";
import { validateGoogleToken } from "./integration.service";

export const getUserMeetingsService = async (
  userId: string,
  filter: MeetingFilterEnumType
) => {
  const meetingRepository = AppDataSource.getRepository(Meeting);
  const where: any = { user: { id: userId } };
  // created a clause to get the service from the mentioned user Id with the where claause declared above

  if (filter === MeetingFilterENum.UPCOMING) {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = MoreThan(new Date());
  } else if (filter === MeetingFilterENum.PAST) {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = LessThan(new Date());
  } else if (filter === MeetingFilterENum.CANCELLED) {
    where.status = MeetingStatus.CANCELLED;
  } else {
    where.status = MeetingStatus.SCHEDULED;
    where.startTime = MoreThan(new Date());
  }

  const meetings = await meetingRepository.find({
    where,
    relations: ["event"],
    order: { startTime: "ASC" },
  });

  return meetings || [];
};

export const createMeetBookingForGuestService = async (
  createMeetingDto: CreateMeetingDto
) => {
  const { eventId, guestName, guestEmail, additionalInfo } = createMeetingDto;
  const startTime = new Date(createMeetingDto.startTime);
  const endTime = new Date(createMeetingDto.endTime);

  const eventRepository = AppDataSource.getRepository(Event);
  const meetingRepository = AppDataSource.getRepository(Meeting);
  const IntegrationRepository = AppDataSource.getRepository(Integration);

  // We are finding the event related to the user and storing it in the event clause
  const event = await eventRepository.findOne({
    where: { id: eventId, isPrivate: false }, // remember you have made a change when id had some error (without the syntgax "as any")
    relations: ["user"],
  });
  // throws an NotFoundException error when Event not found related to the user.(when it is not created before itself)
  if (!event) throw new NotFoundException("Event not Found");

  if (!Object.values(EventLocationTypeEnum).includes(event.locationType)) {
    throw new BadRequestException("Invalid Location type");
  }

  const meetingIntegration = await IntegrationRepository.findOne({
    where: {
      user: { id: event.user.id },
      app_type: IntegrationAppTypeEnum[event.locationType], // remember you have changed this line of code
    },
  });

  if (!meetingIntegration) {
    throw new BadRequestException(
      "No Video Conferencing Integration found with the User"
    );
  }

  let meetLink: string = "";
  let calendarEventId: string = "";
  let calendarAppType: string = "";

  if (event.locationType === EventLocationTypeEnum.GOOGLE_MEET_AND_CALENDAR) {
    const { calendarType, calendar } = await getCalendarClient(
      meetingIntegration.app_type,
      meetingIntegration.access_token,
      meetingIntegration.refresh_token,
      meetingIntegration.expiry_date
    );

    const response = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${guestName} - ${event.title}`,
        description: additionalInfo,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: startTime.toISOString() },
        attendees: [{ email: guestEmail }, { email: event.user.email }],
        conferenceData: {
          createRequest: {
            requestId: `${event.id} - ${Date.now()}`,
          },
        },
      },
    });

    meetLink = response.data.hangoutLink!;
    calendarEventId = response.data.id!;
    calendarAppType = calendarType;
  }

  const meeting = meetingRepository.create({
    event: { id: event.id },
    user: event.user,
    guestName,
    guestEmail,
    additionalInfo,
    startTime,
    endTime,
    meetLink: meetLink,
    calendarAppType: calendarAppType,
    calendarEventId: calendarEventId,
  });

  await meetingRepository.save(meeting);

  return {
    meetLink,
    meeting,
  };
};

export const cancelMeetingService = async (meetingId: string) => {
  const meetingRepository = AppDataSource.getRepository(Meeting);
  const IntegrationRepository = AppDataSource.getRepository(Integration);

  const meeting = await meetingRepository.findOne({
    where: { id: meetingId },
    relations: ["event", "event.user"],
  });

  if (!meeting) {
    throw new BadRequestException("Event/Meeting does not exist");
  }

  try {
    const calendarIntegration = await IntegrationRepository.findOne({
      where: {
        app_type:
          IntegrationAppTypeEnum[
            meeting.calendarAppType as keyof typeof IntegrationAppTypeEnum
          ],
      },
    });

    if (calendarIntegration) {
      const { calendar, calendarType } = await getCalendarClient(
        calendarIntegration.app_type,
        calendarIntegration.access_token,
        calendarIntegration.refresh_token,
        calendarIntegration.expiry_date
      );

      switch (calendarType) {
        case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR:
          await calendar.events.delete({
            calendarId: "primary",
            eventId: meeting.calendarEventId,
          });
          break;

        default:
          throw new BadRequestException(`Unsupport calendar ${calendarType}`);
      }
    }
  } catch (error) {
    throw new BadRequestException(
      `Failed to delete the meeting/event from calendar`
    );
  }

  meeting.status = MeetingStatus.CANCELLED;
  await meetingRepository.save(meeting);
  return { success: true };
};

async function getCalendarClient(
  appType: IntegrationAppTypeEnum,
  access_token: string,
  refresh_token: string,
  expiry_date: number | null
) {
  switch (appType) {
    case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR:
      const validToken = await validateGoogleToken(
        access_token,
        refresh_token,
        expiry_date
      );

      googleOAuth2Client.setCredentials({ access_token: validToken });

      const calendar = google.calendar({
        version: "v3",
        auth: googleOAuth2Client,
      });

      return {
        calendar,
        calendarType: IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
      };

    default:
      throw new BadRequestException(`Unknown calendar type : ${appType}`);
  }
}
