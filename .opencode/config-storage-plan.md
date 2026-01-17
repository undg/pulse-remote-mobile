# Config storage plan (RN)

Goals
- Persist connection and UI settings locally; no auth.
- Editable: `hostname`, `port`, `endpoint` → derive `serverUrl`.
- Editable: `minVolume`, `maxVolume`, `stepVolume`.
- Toggle: `showMonitoredSources`.
- Actions: reset to defaults; auto-detect host/port from device context.

Storage
- Use AsyncStorage (via @react-native-async-storage/async-storage) or equivalent persistent store.
- Schema validate on load (Zod or lightweight checks) to keep values in bounds.

Defaults (mirror web)
- `hostname`: device hostname or detected host.
- `port`: `8448`.
- `endpoint`: `/api/v1/ws`.
- `serverUrl`: `ws://${hostname}:${port}${endpoint}` (derived, not user-editable).
- `minVolume`: 0; `maxVolume`: 150; `stepVolume`: 5.
- `showMonitoredSources`: true.

API
- Hook `useConfig()` returning `[config, updateConfig, resetConfig, detectConfig]`.
- Derive `serverUrl` inside setter to avoid manual edits.

UI notes
- Config screen should show full `serverUrl` read-only.
- Provide buttons for reset/detect.
- Clamp slider inputs to min/max; keep numeric inputs safe.
