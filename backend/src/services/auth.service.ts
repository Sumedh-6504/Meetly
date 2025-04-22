import { v4 as uuidv4 } from "uuid";
import { AppDataSource } from "../config/database.config";
import { Availability } from "../databases/entities/availability.entity";
import {
  DayAvailability,
  dayOfWeekEnum,
} from "../databases/entities/day-availability";
import { User } from "../databases/entities/user.entity";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/app-error";
import { LoginDto, RegisterDto } from "../databases/dto/auth.dto";
import { signJwtToken } from "../utils/jwt";

export const registerService = async (registerDto: RegisterDto) => {
  const userRepository = AppDataSource.getRepository(User);
  const availabilityRepository = AppDataSource.getRepository(Availability);
  const dayAvailabilityRepository =
    AppDataSource.getRepository(DayAvailability);

  const existingUser = await userRepository.findOne({
    where: { email: registerDto.email },
  });

  if (existingUser) {
    throw new BadRequestException("User already exists");
  }

  const username = await generateUsername(registerDto.name);
  const user = userRepository.create({
    ...registerDto,
    username,
  });

  const availability = availabilityRepository.create({
    timeGap: 30,
    days: Object.values(dayOfWeekEnum).map((day) => {
      return dayAvailabilityRepository.create({
        day: day,
        startTime: new Date(`2025-03-01T09:00:00Z`), //9:00
        endTime: new Date(`2025-03-01T17:00:00Z`), //5:00pm
        isAvailable:
          day !== dayOfWeekEnum.SUNDAY && day !== dayOfWeekEnum.SATURDAY,
      });
    }),
  });

  user.availability = availability;

  await userRepository.save(user);

  return { user: user.omitPassword() };
};

export const loginService = async (loginDto: LoginDto) => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { email: loginDto.email },
  });

  if (!user) {
    throw new NotFoundException("User Not Found!");
  }

  const isValidPassword = await user.comparePassword(loginDto.password);

  if (!isValidPassword) {
    throw new UnauthorizedException("Invalid Credentials/Email");
  }

  const { token, expiresAt } = signJwtToken({ userId: user.id });

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
  };
};

// Function for generating username and JWT Token
async function generateUsername(name: string): Promise<string> {
  const cleanName = name.replace(`/\s+/g`, "").toLowerCase();
  const baseUserName = cleanName;

  const uuidSuffix = uuidv4().replace(`/\s+/g`, ``).slice(0, 4);
  const userRepository = await AppDataSource.getRepository(User);

  let username = `${baseUserName}${uuidSuffix}`;
  let existingUser = await userRepository.findOne({
    where: { username },
  });

  while (existingUser) {
    let username = `${baseUserName}${uuidv4()
      .replace(`/\s+/g`, ``)
      .slice(0, 4)}`;
    existingUser = await userRepository.findOne({
      where: { username },
    });
  }

  return username;
}
