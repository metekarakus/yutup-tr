export type DeviceInfo = {
  deviceType: "mobile" | "desktop" | "tablet";
  os: "ios" | "android" | "other";
};

export function parseDevice(userAgent: string): DeviceInfo {
  const normalized = userAgent.toLowerCase();

  const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(normalized);
  const isMobile = /iphone|ipod|android.*mobile|windows phone|blackberry/i.test(normalized);

  const os: DeviceInfo["os"] = normalized.includes("iphone") || normalized.includes("ipad")
    ? "ios"
    : normalized.includes("android")
      ? "android"
      : "other";

  return {
    deviceType: isTablet ? "tablet" : isMobile ? "mobile" : "desktop",
    os
  };
}
