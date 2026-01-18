import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useWebSocketClient } from 'ws/client'
import { Action } from 'config/generated/message'
import type { OutgoingMessage } from 'config/generated/message'
import type { PrapiStatus, Sink, SinkInput, Source } from 'config/generated/status'

// simple throttle helper
function throttle<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let last = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastArgs: any[] | null = null

  return (...args: any[]) => {
    const now = Date.now()
    lastArgs = args
    if (now - last >= delay) {
      last = now
      fn(...args)
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now()
        timer = null
        if (lastArgs) fn(...(lastArgs as any[]))
      }, delay - (now - last))
    }
  }
}

export type VolumeState = {
  status: PrapiStatus | null
  blocked: boolean
}

export type VolumeActions = {
  setSinkVolume: (name: string, volume: number) => void
  toggleSinkMuted: (name: string) => void
  setSinkInputVolume: (id: number, volume: number) => void
  toggleSinkInputMuted: (id: number) => void
  moveSinkInput: (name: string, id: number) => void
  setSourceVolume: (name: string, volume: number) => void
  toggleSourceMuted: (name: string) => void
}

export const RELEASE_OPTIMISTIC_TIME = 150
export const THROTTLE_TIME = 100

export function useVolumeStore(url: string, throttleMs = THROTTLE_TIME) {
  const { status: wsStatus, lastJson, send, reconnect, close } = useWebSocketClient({ url, enabled: Boolean(url) })
  const lastStatusPayload = useRef<PrapiStatus | null>(null)
  const [state, setState] = useState<VolumeState>({ status: null, blocked: false })
  const stateRef = useRef<VolumeState>({ status: null, blocked: false })
  const blockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const next: VolumeState = { status: null, blocked: false }
    setState(next)
    stateRef.current = next
  }, [url])

  // apply incoming status
  useEffect(() => {
    if (lastJson && typeof lastJson === 'object' && lastJson.action === Action.GetStatus && lastJson.payload) {
      lastStatusPayload.current = lastJson.payload as PrapiStatus
      setState(prev => {
        if (prev.blocked) return prev
        const next: VolumeState = { ...prev, status: lastStatusPayload.current }
        stateRef.current = next
        return next
      })
    }
  }, [lastJson])

  const unblockLater = useCallback(() => {
    if (blockTimerRef.current) clearTimeout(blockTimerRef.current)
    blockTimerRef.current = setTimeout(() => {
      setState(prev => {
        const next = { ...prev, blocked: false }
        stateRef.current = next
        return next
      })
    }, RELEASE_OPTIMISTIC_TIME)
  }, [])

  const optimistic = useCallback(
    (updater: (draft: PrapiStatus) => void) => {
      setState(prev => {
        if (!prev.status) return prev
        const nextStatus: PrapiStatus = JSON.parse(JSON.stringify(prev.status)) as PrapiStatus
        updater(nextStatus)
        const next: VolumeState = { status: nextStatus, blocked: true }
        stateRef.current = next
        return next
      })
      unblockLater()
    },
    [unblockLater],
  )

  // throttled send wrappers
  const sendThrottled = useMemo(() => throttle((message: OutgoingMessage | string) => send(message), throttleMs), [send, throttleMs])

  const setSinkVolume = useCallback(
    (name: string, volume: number) => {
      optimistic(draft => {
        const sink = draft.sinks.find((s: Sink) => s.name === name)
        if (sink) sink.volume = volume
      })
      sendThrottled({ action: Action.SetSinkVolume, payload: { name, volume } })
    },
    [optimistic, sendThrottled],
  )

  const toggleSinkMuted = useCallback(
    (name: string) => {
      const currentMuted = stateRef.current.status?.sinks.find((s: Sink) => s.name === name)?.muted ?? false
      const nextMuted = !currentMuted
      optimistic(draft => {
        const sink = draft.sinks.find((s: Sink) => s.name === name)
        if (sink) sink.muted = nextMuted
      })
      sendThrottled({ action: Action.SetSinkMuted, payload: { name, muted: nextMuted } })
    },
    [optimistic, sendThrottled],
  )

  const setSinkInputVolume = useCallback(
    (id: number, volume: number) => {
      optimistic(draft => {
        const si = draft.sinkInputs.find((s: SinkInput) => s.id === id)
        if (si) si.volume = volume
      })
      sendThrottled({ action: Action.SetSinkInputVolume, payload: { id, volume } })
    },
    [optimistic, sendThrottled],
  )

  const toggleSinkInputMuted = useCallback(
    (id: number) => {
      const currentMuted = stateRef.current.status?.sinkInputs.find((s: SinkInput) => s.id === id)?.muted ?? false
      const nextMuted = !currentMuted
      optimistic(draft => {
        const si = draft.sinkInputs.find((s: SinkInput) => s.id === id)
        if (si) si.muted = nextMuted
      })
      sendThrottled({ action: Action.SetSinkInputMuted, payload: { id, muted: nextMuted } })
    },
    [optimistic, sendThrottled],
  )

  const moveSinkInput = useCallback(
    (name: string, id: number) => {
      optimistic(draft => {
        const si = draft.sinkInputs.find((s: SinkInput) => s.id === id)
        const sink = draft.sinks.find((s: Sink) => s.name === name)
        if (si && sink) si.sinkId = sink.id
      })
      send({ action: Action.MoveSinkInput, payload: { name, id } })
    },
    [optimistic, send],
  )

  const setSourceVolume = useCallback(
    (name: string, volume: number) => {
      optimistic(draft => {
        const source = draft.sources.find((s: Source) => s.name === name)
        if (source) source.volume = volume
      })
      sendThrottled({ action: Action.SetSourceVolume, payload: { name, volume } })
    },
    [optimistic, sendThrottled],
  )

  const toggleSourceMuted = useCallback(
    (name: string) => {
      const currentMuted = stateRef.current.status?.sources.find((s: Source) => s.name === name)?.muted ?? false
      const nextMuted = !currentMuted
      optimistic(draft => {
        const source = draft.sources.find((s: Source) => s.name === name)
        if (source) source.muted = nextMuted
      })
      sendThrottled({ action: Action.SetSourceMuted, payload: { name, muted: nextMuted } })
    },
    [optimistic, sendThrottled],
  )

  const actions: VolumeActions = {
    setSinkVolume,
    toggleSinkMuted,
    setSinkInputVolume,
    toggleSinkInputMuted,
    moveSinkInput,
    setSourceVolume,
    toggleSourceMuted,
  }

  const derived = useMemo(() => {
    const sinks = state.status?.sinks ?? []
    const sinkInputs = state.status?.sinkInputs ?? []
    const sources = state.status?.sources ?? []
    const buildInfo = state.status?.buildInfo
    return { sinks, sinkInputs, sources, buildInfo }
  }, [state.status])

  return { ...state, ...derived, wsStatus, reconnect, close, ...actions }
}
