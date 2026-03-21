import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc } from "drizzle-orm";
import MessageManager from "@/components/admin/MessageManager";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const allMessages = await db.select().from(messages).orderBy(desc(messages.createdAt));

  return <MessageManager initialMessages={allMessages} />;
}
