# pulse-remote-web architecture findings (for React Native port)

- **Purpose**: Web UI controlling PulseAudio via pulse-remote websocket server.
- **Entry/App**: `src/app.tsx` wraps `Router` with `BrowserRouter`, suspense shows `LoadingOrError` fallback.
- **Routes** (`src/router.tsx`):
  - `/` → `ControllerSinks`
  - `/sources` → `ControllerSources`
  - `/about` → `About`
  - `/config` → `Config`
- **Config** (`src/config/use-config.tsx` + `schema.ts`):
  - Stored in localStorage via Jotai `atomWithStorage` key `pr-web-config`.
  - Defaults derive server URL: `ws://${hostname}:${port}${endpoint}` (hostname from window). Controls `minVolume`, `maxVolume`, `stepVolume`, `showMonitoredSources`.
  - `Config` page allows detect/reset and toggles showing monitored sources.
- **State & data**:
  - Websocket client hook `useWebSocketApi` (react-use-websocket) with auto-reconnect, exposes `sendMessage`, `lastMessage`, `status`.
  - Volume state hook `useVolumeStatus`: Jotai atoms (`volStatusAtom`, `volStatusBlockAtom`), optimistic updates, throttled sends. Handles sinks, sinkInputs, sources, move sink inputs, mute/volume toggles.
  - Incoming messages parsed as `IncomingMessage` (action `GetStatus`, payload `PrapiStatus`).
- **Generated types** (`src/generated`):
  - `message.ts` `Action` enum for WS commands (GetStatus, SetSinkVolume, etc.).
  - `status.ts` `PrapiStatus` structure: `sinks`, `sinkInputs`, `sources`, `buildInfo`.
- **UI**:
  - Layout with top nav (`TopNav`) for sinks/sources/about/config, theme toggle.
  - Main screens:
    - `ControllerSinks`: list sinks with `VolumeSlider`; nested sink inputs draggable between sinks (`@dnd-kit`). Vibrate on changes, optimistic updates, throttled sends.
    - `ControllerSources`: list sources with `VolumeSlider`; hides monitor sources unless configured.
  - Components: `VolumeSlider` (uses Radix Slider), `ServerInfo` (build metadata), `LoadingOrError` fallback.
  - Theming via `useTheme`; Tailwind/Shadcn primitives for UI.
- **Interactions**:
  - Controls: set/mute sink, set/mute sink input, move sink input, set/mute source. Actions mapped to websocket messages.
  - Real-time updates: server broadcasts `GetStatus` payload; hook updates state unless blocked during optimistic send.
- **Tests**:
  - `app.test.tsx` covers navigation; component tests for `volume-slider`, `loading-or-error`, etc.
- **Key constants**: `VIBRATE_TIME`, `RELEASE_OPTIMISTIC_TIME`, throttle time (`THROTTLE_TIME` in `constant`), `testid` values.

Implications for RN port
- Single primary screen: sinks list with sliders and nested sink inputs; sources screen also present.
- Needs websocket client with auto-reconnect, send/receive JSON, optimistic updates, throttling, and drag/move behavior for sink inputs.
- Config needs local persistence and URL detection but no auth; runs on LAN.
- Theming and navigation adapt to RN stacks; no home screen, start at sinks.
