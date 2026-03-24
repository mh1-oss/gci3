import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  const allMessages = await db
    .select()
    .from(messages)
    .orderBy(desc(messages.createdAt));
  return NextResponse.json(allMessages);
}
