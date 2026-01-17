# Volume state store plan (RN)

Goals
- Track `PrapiStatus` (`sinks`, `sinkInputs`, `sources`, `buildInfo`).
- Provide actions with optimistic updates + throttled send via websocket client.
- Mirror web behaviors: optimistic first, block overwrite while in-flight if needed.

State structure
- `status`: latest `PrapiStatus | null`.
- `blocked`: boolean to pause server overwrite during optimistic windows.
- Derived selectors: sinks, sinkInputs by sinkId, sources (filtered by config), buildInfo.

Actions
- `setSinkVolume(name, volume)` → optimistic mutate sink.volume, send `SetSinkVolume`.
- `toggleSinkMuted(name)` → flip muted, send `SetSinkMuted` with new value.
- `setSinkInputVolume(id, volume)` → optimistic mutate sinkInput.volume, send `SetSinkInputVolume`.
- `toggleSinkInputMuted(id)` → send `SetSinkInputMuted` with toggled value.
- `moveSinkInput(name, id)` → update sinkId locally, send `MoveSinkInput`.
- `setSourceVolume(name, volume)` → optimistic mutate source.volume, send `SetSourceVolume`.
- `toggleSourceMuted(name)` → flip muted, send `SetSourceMuted`.

Throttling & optimistic handling
- Shared throttled wrapper (e.g., per action type) to limit sends; immediate optimistic writes to store.
- On `GetStatus` messages: if `blocked` true, skip overwrite; otherwise replace status.
- After send commit, release `blocked` after short delay (like web’s `RELEASE_OPTIMISTIC_TIME`).

Config interplay
- Store consumes config for volume bounds (min/max) but should rely on UI to enforce ranges.

Implementation suggestion
- Zustand or Jotai equivalent in RN; expose hook `useVolumeStore` returning state + actions + flags.
