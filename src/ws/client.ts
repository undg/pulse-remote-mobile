import { useEffect, useRef, useState, useCallback } from 'react'

export type WsStatus = 'Connecting' | 'Open' | 'Closing' | 'Closed'

export type WsClientOptions = {
  url: string
  reconnect?: boolean
  reconnectIntervalsMs?: number[]
}

export type WsClient = {
  status: WsStatus
  lastMessage?: MessageEvent<any>
  lastJson?: any
  send: (data: any) => void
  reconnect: () => void
  close: () => void
}

const defaultBackoff = [1000, 2000, 5000]

export function useWebSocketClient({ url, reconnect = true, reconnectIntervalsMs = defaultBackoff }: WsClientOptions): WsClient {
  const [status, setStatus] = useState<WsStatus>('Connecting')
  const [lastMessage, setLastMessage] = useState<MessageEvent<any> | undefined>(undefined)
  const [lastJson, setLastJson] = useState<any>(undefined)
  const socketRef = useRef<WebSocket | null>(null)
  const retryIndexRef = useRef(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentUrlRef = useRef(url)

  const cleanup = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
    if (socketRef.current) {
      socketRef.current.onclose = null
      socketRef.current.onmessage = null
      socketRef.current.onerror = null
      socketRef.current.onopen = null
      socketRef.current.close()
      socketRef.current = null
    }
  }, [])

  const connect = useCallback(
    (nextUrl?: string) => {
      const targetUrl = nextUrl ?? currentUrlRef.current
      currentUrlRef.current = targetUrl
      cleanup()
      setStatus('Connecting')
      const ws = new WebSocket(targetUrl)
      socketRef.current = ws

      ws.onopen = () => {
        setStatus('Open')
        retryIndexRef.current = 0
      }

      ws.onmessage = event => {
        setLastMessage(event)
        try {
          const parsed = JSON.parse(event.data)
          setLastJson(parsed)
        } catch (e) {
          // non-json payloads ignored for lastJson
        }
      }

      ws.onerror = () => {
        setStatus('Closing')
      }

      ws.onclose = () => {
        setStatus('Closed')
        if (reconnect) {
          const delay = reconnectIntervalsMs[Math.min(retryIndexRef.current, reconnectIntervalsMs.length - 1)]
          retryIndexRef.current = Math.min(retryIndexRef.current + 1, reconnectIntervalsMs.length - 1)
          reconnectTimerRef.current = setTimeout(() => connect(currentUrlRef.current), delay)
        }
      }
    },
    [cleanup, reconnect, reconnectIntervalsMs],
  )

  const send = useCallback((data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const payload = typeof data === 'string' ? data : JSON.stringify(data)
      socketRef.current.send(payload)
    }
  }, [])

  const reconnectNow = useCallback(() => {
    retryIndexRef.current = 0
    connect(currentUrlRef.current)
  }, [connect])

  const close = useCallback(() => {
    reconnectTimerRef.current && clearTimeout(reconnectTimerRef.current)
    reconnectTimerRef.current = null
    reconnect && (retryIndexRef.current = 0)
    socketRef.current?.close()
  }, [reconnect])

  useEffect(() => {
    connect(url)
    return () => {
      cleanup()
    }
  }, [url, connect, cleanup])

  return {
    status,
    lastMessage,
    lastJson,
    send,
    reconnect: reconnectNow,
    close,
  }
}
