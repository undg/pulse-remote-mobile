# Status shape (PrapiStatus)

Source: `pulse-remote-web/src/generated/status.ts`.

Top-level `PrapiStatus` fields
- `buildInfo: BuildInfo`
- `sinkInputs: SinkInput[]`
- `sinks: Sink[]`
- `sources: Source[]`

`BuildInfo`
- `buildDate: string`
- `compiler: string`
- `gitCommit: string`
- `gitVersion: string`
- `goVersion: string`
- `platform: string`

`Sink`
- `id: number` (same as name)
- `label: string`
- `muted: boolean`
- `name: string`
- `volume: number`

`SinkInput`
- `id: number`
- `label: string`
- `muted: boolean`
- `sinkId: number` (parent sink id)
- `volume: number`

`Source`
- `id: number`
- `label: string`
- `monitor: string`
- `monitored: boolean`
- `muted: boolean`
- `name: string`
- `volume: number`

RN usage notes
- Sinks screen shows `sinks` with nested `sinkInputs` filtered by `sinkId`.
- Sources screen shows `sources`; hide `monitored` when config says so.
- Server info screen uses `buildInfo` fields.
- Optimistic updates should mirror these shapes and keep `id`/`sinkId` relations intact.
