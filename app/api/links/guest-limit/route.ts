import { NextResponse } from "next/server";
import { getGuestLimitInfo } from "@/lib/limits";

export async function GET() {
  const { info } = await getGuestLimitInfo();
  return NextResponse.json(info);
}
