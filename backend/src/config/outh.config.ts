import { google } from "googleapis";
import { config } from "./app.config";

export const redirectUri =
  config.NODE_ENV === "production"
    ? config.GOOGLE_REDIRECT_URI
    : "http://localhost:8000/api/integration/google/calls";

// Google Auth
export const googleOAuth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  redirectUri
);

// Zoom Auth
