import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);

export default authRoutes;

/*
! --> Non-Null Assertion
above thing is used when you are sure that atleast one item is present in an array

? --> Optional Chaining
example usage : availability[0]?.days

So the above thing checks is there any element in the availability array .. if so it continues with the days else it returns undefined without crashing the backedn server localhost:8000
*/
