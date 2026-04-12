```javascript
export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
};

export const PROTECTED_ROUTES = {
  EVENT_TYPES: "/app/event_types",
  INTEGRATIONS: "/app/integrations",
  AVAILABILITY: "/app/availability/schedules",
  MEETINGS: "/app/scheduled_events",
};

export const PUBLIC_ROUTES = {
  USER_EVENTS: "/user/:username",
  USER_SINGLE_EVENT: "/user/:username/:slug",
};

export const sanitizePath = (path: string): string => {
  return path.replace(/\/+/g, '/').replace(/\/\./g, '').replace(/\/\.\./g, '');
};

export const getPublicRoute = (route: string, params: { [key: string]: string }): string => {
  let path = PUBLIC_ROUTES[route as keyof typeof PUBLIC_ROUTES];
  if (path) {
    Object.keys(params).forEach((key) => {
      path = path.replace(`:${key}`, encodeURIComponent(params[key]));
    });
    return sanitizePath(path);
  }
  return '';
};
```