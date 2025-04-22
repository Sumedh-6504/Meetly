import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
  cancelMeetingController,
  createMeetBookingForGuestController,
  getUserMeetingsController,
} from "../controllers/meeting.controller";
import { MeetingStatus } from "../databases/entities/meeting.entity";

const meetingRoutes = Router();

meetingRoutes.get(
  "/user/all",
  passportAuthenticateJwt,
  getUserMeetingsController
);

meetingRoutes.post("/public/create", createMeetBookingForGuestController);

meetingRoutes.put(
  "/cancel/:meetingId",
  passportAuthenticateJwt,
  cancelMeetingController
);

export default meetingRoutes;
