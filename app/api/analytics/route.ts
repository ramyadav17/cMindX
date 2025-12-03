import { NextResponse } from "next/server";

type AnalyticsEvent = {
  sessionId: string;
  eventType: string;
  payload: Record<string, unknown>;
  ts: string;
  variantId?: string;
};

const events: AnalyticsEvent[] = [];

export async function POST(request: Request) {
  const body = (await request.json()) as AnalyticsEvent;

  events.push(body);
  console.log("[Analytics event]", body);

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    count: events.length,
    events
  });
}
