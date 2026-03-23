/**
 * Simple in-memory event emitter for Server-Sent Events (SSE).
 * Stores active SSE response controllers globally (works in dev; 
 * on serverless uses polling as fallback automatic via client).
 */

type Listener = () => void;

declare global {
  // eslint-disable-next-line no-var
  var __messageListeners: Set<Listener> | undefined;
}

// Persist across hot reloads in dev
if (!global.__messageListeners) {
  global.__messageListeners = new Set();
}

export function addMessageListener(fn: Listener) {
  global.__messageListeners!.add(fn);
}

export function removeMessageListener(fn: Listener) {
  global.__messageListeners!.delete(fn);
}

export function emitNewMessage() {
  global.__messageListeners!.forEach((fn) => fn());
}
