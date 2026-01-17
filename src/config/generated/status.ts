export type PrapiStatus = {
  buildInfo: BuildInfo
  sinkInputs: SinkInput[]
  sinks: Sink[]
  sources: Source[]
}

export type BuildInfo = {
  buildDate: string
  compiler: string
  gitCommit: string
  gitVersion: string
  goVersion: string
  platform: string
}

export type SinkInput = {
  id: number
  label: string
  muted: boolean
  sinkId: number
  volume: number
}

export type Sink = {
  id: number
  label: string
  muted: boolean
  name: string
  volume: number
}

export type Source = {
  id: number
  label: string
  monitor: string
  monitored: boolean
  muted: boolean
  name: string
  volume: number
}
