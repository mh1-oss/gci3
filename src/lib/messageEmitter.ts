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

declare global {
  // eslint-disable-next-line no-var
  var __messageListeners: Set<Listener> | undefined;
}

// Support for both Node.js (global) and Edge (globalThis)
const g = (typeof globalThis !== 'undefined' ? globalThis : global) as any;

if (!g.__messageListeners) {
  g.__messageListeners = new Set();
}

export function addMessageListener(fn: Listener) {
  g.__messageListeners.add(fn);
}

export function removeMessageListener(fn: Listener) {
  g.__messageListeners.delete(fn);
}

export function emitNewMessage() {
  if (g.__messageListeners) {
    g.__messageListeners.forEach((fn: any) => fn());
  }
}
