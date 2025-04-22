export const MeetingFilterENum = {
  UPCOMING: "UPCOMING",
  CANCELLED: "CANCELLED",
  PAST: "PAST",
} as const;

export type MeetingFilterEnumType =
  (typeof MeetingFilterENum)[keyof typeof MeetingFilterENum];
