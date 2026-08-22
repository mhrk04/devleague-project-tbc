import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "cafe-retention-demo",
    message: "health check",
  });
}
