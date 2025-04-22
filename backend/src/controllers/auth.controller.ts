// import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Response, Request } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { LoginDto, RegisterDto } from "../databases/dto/auth.dto";
import { asyncHandlerAndValidation } from "../middlewares/withValidation.middleware";
import { loginService, registerService } from "../services/auth.service";

export const registerController = asyncHandlerAndValidation(
  RegisterDto,
  "body",
  async (req: Request, res: Response, registerDto) => {
    const { user } = await registerService(registerDto);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created Successfully",
      user,
    });
  }
);

export const loginController = asyncHandlerAndValidation(
  LoginDto,
  "body",
  async (req: Request, res: Response, loginDto) => {
    const { user, accessToken, expiresAt } = await loginService(loginDto);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User logged in Successfully",
      user,
      accessToken,
      expiresAt,
    });
  }
);
