import { useEffect, useRef, useState, useCallback } from "react";
import type { IncomingMessage, OutgoingMessage } from "config/messageTypes";

export type WsStatus = "Connecting" | "Open" | "Closing" | "Closed";

export type WsClientOptions = {
  url: string;
  reconnect?: boolean;
  reconnectIntervalsMs?: number[];
  enabled?: boolean;
};

export type WsClient = {
  status: WsStatus;
  lastMessage?: MessageEvent<any>;
  lastJson?: IncomingMessage;
  send: (data: OutgoingMessage | string) => void;
  reconnect: () => void;
  close: () => void;
};

const defaultBackoff = [1000, 2000, 5000];

export function useWebSocketClient({
  url,
  reconnect = true,
  reconnectIntervalsMs = defaultBackoff,
  enabled = true,
}: WsClientOptions): WsClient {
  const [status, setStatus] = useState<WsStatus>("Connecting");
  const [lastMessage, setLastMessage] = useState<MessageEvent<any> | undefined>(
    undefined,
  );
  const [lastJson, setLastJson] = useState<IncomingMessage | undefined>(
    undefined,
  );
  const socketRef = useRef<WebSocket | null>(null);
  const retryIndexRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentUrlRef = useRef(url);

  const cleanup = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.onclose = null;
      socketRef.current.onmessage = null;
      socketRef.current.onerror = null;
      socketRef.current.onopen = null;
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const connect = useCallback(
    (nextUrl?: string) => {
      const targetUrl = nextUrl ?? currentUrlRef.current;
      if (!targetUrl) {
        setStatus("Closed");
        return;
      }
      currentUrlRef.current = targetUrl;
      cleanup();
      setStatus("Connecting");
      console.warn("WS connect", targetUrl);
      const ws = new WebSocket(targetUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.warn("WS open", targetUrl);
        setStatus("Open");
        retryIndexRef.current = 0;
      };

      ws.onmessage = (event) => {
        setLastMessage(event);
        try {
          const parsed = JSON.parse(event.data);
          setLastJson(parsed);
        } catch (e) {
          // non-json payloads ignored for lastJson
        }
      };

      ws.onerror = (event) => {
        console.warn("WS error", targetUrl, event?.type ?? "");
        setStatus("Closing");
      };

      ws.onclose = (event) => {
        console.warn("WS close", targetUrl, event.code, event.reason);
        setStatus("Closed");
        if (reconnect) {
          const delay =
            reconnectIntervalsMs[
              Math.min(retryIndexRef.current, reconnectIntervalsMs.length - 1)
            ];
          retryIndexRef.current = Math.min(
            retryIndexRef.current + 1,
            reconnectIntervalsMs.length - 1,
          );
          reconnectTimerRef.current = setTimeout(
            () => connect(currentUrlRef.current),
            delay,
          );
        }
      };
    },
    [cleanup, reconnect, reconnectIntervalsMs],
  );

  const send = useCallback((data: OutgoingMessage | string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const payload = typeof data === "string" ? data : JSON.stringify(data);
      socketRef.current.send(payload);
    }
  }, []);

  const reconnectNow = useCallback(() => {
    retryIndexRef.current = 0;
    connect(currentUrlRef.current);
  }, [connect]);

  const close = useCallback(() => {
    reconnectTimerRef.current && clearTimeout(reconnectTimerRef.current);
    reconnectTimerRef.current = null;
    reconnect && (retryIndexRef.current = 0);
    socketRef.current?.close();
  }, [reconnect]);

  useEffect(() => {
    if (enabled && url) {
      connect(url);
    }
    return () => {
      cleanup();
    };
  }, [url, connect, cleanup, enabled]);

  return {
    status,
    lastMessage,
    lastJson,
    send,
    reconnect: reconnectNow,
    close,
  };
}
