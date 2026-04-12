```javascript
import { getKey } from "../utils/get-env";

// returns the keys required for the app from the .env file
const appConfig = () => ({
  PORT: getKey("PORT", "8000"),
  NODE_ENV: getKey("NODE_ENV", "development"),
  BASE_PATH: getKey("BASE_PATH", "/api"),

  DATABASE_URL: getKey("DATABASE_URL"),

  JWT_SECRET: getKey("JWT_SECRET"),
  JWT_EXPIRES_IN: getKey("JWT_EXPIRES_IN", "1d"),

  GOOGLE_CLIENT_ID: getKey("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getKey("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: getKey("GOOGLE_REDIRECT_URI"),

  FRONTEND_ORIGIN: getKey("FRONTEND_ORIGIN", "localhost"),
  FRONTEND_INTEGRATION_URL: getKey("FRONTEND_INTEGRATION_URL"),
});

export const config = appConfig();
```