import { AppDataSource } from "../config/database.config";
import { googleOAuth2Client } from "../config/outh.config";
import {config} from "../config/app.config";
import { config } 
import {
  Integration,
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
  IntegrationProviderEnum,
} from "../databases/entities/integration.entity";
import { BadRequestException } from "../utils/app-error";
import { encodeState } from "../utils/helper";

const appTypeToProviderMap: Record<
  IntegrationAppTypeEnum,
  IntegrationProviderEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]:
    IntegrationProviderEnum.GOOGLE,
  [IntegrationAppTypeEnum.ZOOM_MEETING]: IntegrationProviderEnum.ZOOM,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationProviderEnum.MICROSOFT,
};

const appTypeToCategoryMap: Record<
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]:
    IntegrationCategoryEnum.CALENDAR_AND_VIDEO_CONFERENCING,
  [IntegrationAppTypeEnum.ZOOM_MEETING]:
    IntegrationCategoryEnum.VIDEO_CONFERENCING,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationCategoryEnum.CALENDAR,
};

const appTypeToTitleMap: Record<IntegrationAppTypeEnum, string> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]: "Google Meet & Calendar",
  [IntegrationAppTypeEnum.ZOOM_MEETING]: "Zoom",
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: "Microsoft Outlook Calendar",
};

export const getUserIntegrationsService = async (userId: string) => {
  const integrationRepository = AppDataSource.getRepository(Integration);

  // 2. Query all integrations where the user ID matches
  const userIntegrations = await integrationRepository.find({
    where: { user: { id: userId } },
  });

  // 3. Make a map of app_type => true for quick lookup
  const connectedMap = new Map(
    userIntegrations.map((integration) => [integration.app_type, true])
  );

  // 4. For every appType in IntegrationAppTypeEnum, return an object:
  // - provider: from appTypeToProviderMap
  // - title: from appTypeToTitleMap
  // - category: from appTypeToCategoryMap
  // - isConnected: true if in the map
  return Object.values(IntegrationAppTypeEnum).flatMap((appType) => {
    return {
      provider: appTypeToProviderMap[appType],
      title: appTypeToTitleMap[appType],
      category: appTypeToCategoryMap[appType],
      app_type: appType,
      isConnected: connectedMap.has(appType) || false,
    };
  });
};

export const checkIntegrationService = async (
  userId: string,
  appType: IntegrationAppTypeEnum
) => {
  const integrationRepository = AppDataSource.getRepository(Integration);

  const integration = await integrationRepository.findOne({
    where: { user: { id: userId }, app_type: appType },
  });

  if (!integration) {
    return false;
  }

  return true;
};

export const connectAppService = async (
  userId: string,
  appType: IntegrationAppTypeEnum
) => {
  const state = encodeState({ userId, appType });
  
  const redirectUri =
    config.NODE_ENV === "production"
    ? config.GOOGLE_REDIRECT_URI
    : "http://localhost:8000/api/integration/google/calls";

  let authUrl: string;

  switch (appType) {
    case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR:
      authUrl = googleOAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar.events"],
        prompt: "consent",
        state,
        redirectUri: redirectUri
      });
      break;
    default:
      throw new BadRequestException("Unsupported App Type");
  }

  return { url: authUrl };
};

// Now we are creating a integration Service using some data object with some key-values

export const createIntegrationService = async (data: {
  userId: string;
  provider: IntegrationProviderEnum;
  category: IntegrationCategoryEnum;
  app_type: IntegrationAppTypeEnum;
  access_token: string;
  refresh_token?: string;
  expiry_date: number | null;
  metadata: any;
}) => {
  const integrationRepository = AppDataSource.getRepository(Integration);

  const existingIntegration = await integrationRepository.findOne({
    where: {
      userId: data.userId,
      app_type: data.app_type,
    },
  });

  if (existingIntegration) {
    throw new BadRequestException(`${data.app_type} already is connected`);
  }

  const newIntegration = integrationRepository.create({
    userId: data.userId,
    provider: data.provider,
    category: data.category,
    app_type: data.app_type,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: data.expiry_date,
    metadata: data.metadata,
    isConnected: true,
  });

  await integrationRepository.save(newIntegration);

  return newIntegration;
};

export const validateGoogleToken = async (
  accessToken: string,
  refreshToken: string,
  expiryDate: number | null
) => {
  if (expiryDate === null || Date.now() >= expiryDate) {
    googleOAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const { credentials } = await googleOAuth2Client.refreshAccessToken();
    return credentials.access_token;
  }

  return accessToken;
};
