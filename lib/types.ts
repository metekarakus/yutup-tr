export type LinkType = "SHORTEN" | "YOUTUBE" | "SUBSCRIBE";

export type GuestLimitInfo = {
  used: number;
  limit: number;
  remaining: number;
  blocked: boolean;
};
