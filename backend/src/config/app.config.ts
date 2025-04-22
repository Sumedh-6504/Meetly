import { getKey } from "../utils/get-env";

// returns the keys required for the app from the .env file
const appConfig = () => ({
  PORT: getKey("PORT", "8000"),
  NODE_ENV: getKey("NODE_ENV", "development"),
  BASE_PATH: getKey("BASE_PATH", "/api"),

  DATABASE_URL: getKey("DATABASE_URL"),

  JWT_SECRET: getKey("JWT_SECRET", "secret_jwt"),
  JWT_EXPIRES_IN: getKey("JWT_EXPIRES_IN", "1d"),

  GOOGLE_CLIENT_ID: getKey("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getKey("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: getKey("GOOGLE_REDIRECT_URI"),

  FRONTEND_ORIGIN: getKey("FRONTEND_ORIGIN", "localhost"),
  FRONTEND_INTEGRATION_URL: getKey("FRONTEND_INTEGRATION_URL"),
});

export const config = appConfig();

/*
Note: We have added a parenthesis outside the curly praces in the arrow function in order to return an object instead of undefined
In TypeScript (and JavaScript), parentheses are required around curly braces {} when returning an object in an arrow function, like this:

const getUser = () => ({ name: "John", age: 25 });

Reason: Avoiding Ambiguity
Without parentheses, JavaScript thinks {} is a function block instead of an object:

const getUser = () => { name: "John", age: 25 }; // Undefined!
The {} here is treated as a function body, not an object.

Since there is no return statement, the function returns undefined.

Parentheses Force Object Return

const getUser = () => ({ name: "John", age: 25 });
The parentheses () tell JavaScript to treat {} as an object instead of a function block.

The function implicitly returns { name: "John", age: 25 }.
*/
