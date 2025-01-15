import { processMeeting } from "@/lib/assembly";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodyParser = z.object({
  meetingUrl: z.string(),
  meetingId: z.string(),
});

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsedBody = bodyParser.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    const { meetingUrl, meetingId } = parsedBody.data;

    const { summaries } = await processMeeting(meetingUrl);
    await db.issue.createMany({
      data: summaries.map((summary) => {
        return {
          start: summary.start,
          end: summary.end,
          gist: summary.gist,
          headline: summary.headline,
          summary: summary.summary,
          meetingId: meetingId,
        };
      }),
    });
    await db.meeting.update({
      where: { id: meetingId },
      data: {
        status: "COMPLETED",
        name: summaries[0]!.headline,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process meeting" },
      { status: 500 },
    );
  }
}
