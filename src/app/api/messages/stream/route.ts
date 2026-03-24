import { addMessageListener, removeMessageListener } from "@/lib/messageEmitter";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial heartbeat
      controller.enqueue(encoder.encode(": heartbeat\n\n"));

      const listener = () => {
        try {
          controller.enqueue(encoder.encode("event: new-message\ndata: {}\n\n"));
        } catch {
          // Client disconnected
        }
      };

      addMessageListener(listener);

      // Cleanup when client disconnects
      (controller as any)._cleanup = () => {
        removeMessageListener(listener);
      };
    },
    cancel(controller: any) {
      if (controller._cleanup) controller._cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
