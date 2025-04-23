import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { config } from "./config/app.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { intitaliseDatabase } from "./databases/database";
import "reflect-metadata";
import authRoutes from "./routes/auth.route";
import eventRoutes from "./routes/event.route";
import availabilityRoutes from "./routes/availability.route";
import meetingRoutes from "./routes/meeting.route";
import integrationRoutes from "./routes/integration.route";
import passport from "passport";
const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(
  cors({
    origin: String(config.FRONTEND_ORIGIN),
    credentials: true,
  })
);
app.options("*", cors());
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // throw new BadRequestException("throwing sync error");
    res.status(HTTPSTATUS.OK).json({ message: `Hello Subscribers!` });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/event`, eventRoutes);
app.use(`${BASE_PATH}/integration`, integrationRoutes);
app.use(`${BASE_PATH}/availability`, availabilityRoutes);
app.use(`${BASE_PATH}/meeting`, meetingRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  await intitaliseDatabase();
  console.log(
    `Server is listening to the Port ${config.PORT} on ${config.NODE_ENV}`
  );
});
