/**
 * PostMessage utilities for iframe communication
 * Enables bidirectional communication between Career Hub and embedded tools
 */

import type { PostMessageEvent, PostMessageType } from './types'

/**
 * Send a message to an iframe tool
 */
export function sendMessageToTool(
  iframe: HTMLIFrameElement,
  type: PostMessageType,
  data?: any
): void {
  if (!iframe.contentWindow) {
    console.error('Iframe contentWindow not available')
    return
  }

  const message: PostMessageEvent = {
    type,
    data,
    requestId: generateRequestId(),
  }

  // Send to same domain, or use '*' for different domains
  const targetOrigin = process.env.NEXT_PUBLIC_TOOLS_DOMAIN || '*'
  iframe.contentWindow.postMessage(message, targetOrigin)
}

/**
 * Listen for messages from tools
 */
export function listenForToolMessages(
  handler: (event: MessageEvent<PostMessageEvent>) => void
): () => void {
  const listener = (event: MessageEvent) => {
    // Validate origin for security
    const allowedOrigin = process.env.NEXT_PUBLIC_TOOLS_DOMAIN
    if (allowedOrigin && event.origin !== allowedOrigin) {
      console.warn('Rejected message from unauthorized origin:', event.origin)
      return
    }

    // Validate message structure
    if (!event.data || typeof event.data !== 'object' || !event.data.type) {
      return
    }

    handler(event as MessageEvent<PostMessageEvent>)
  }

  window.addEventListener('message', listener)

  // Return cleanup function
  return () => window.removeEventListener('message', listener)
}

/**
 * Generate unique request ID for tracking request/response pairs
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * React hook for tool communication (client component)
 */
export function useToolCommunication() {
  const sendToTool = (
    iframe: HTMLIFrameElement | null,
    type: PostMessageType,
    data?: any
  ) => {
    if (!iframe) {
      console.error('No iframe reference available')
      return
    }
    sendMessageToTool(iframe, type, data)
  }

  return { sendToTool }
}
