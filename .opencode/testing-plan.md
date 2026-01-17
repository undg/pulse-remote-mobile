# Testing plan (LAN pulse-remote server)

Scope
- Validate main flows against a running pulse-remote server on LAN.

Checklist
- Connect over websocket: status becomes Open; initial `GetStatus` received.
- Sinks screen:
  - Adjust sink volume → server receives `SetSinkVolume`; state reflects change.
  - Toggle sink mute → `SetSinkMuted` sent; state reflects change.
  - Adjust sink input volume/mute → corresponding actions sent; reflected.
  - Move sink input to another sink → `MoveSinkInput` sent; status updates.
- Sources screen:
  - Adjust source volume/mute → `SetSourceVolume` / `SetSourceMuted` sent.
  - Config `showMonitoredSources` toggles visibility.
- Config screen:
  - Host/port/endpoint updates cause reconnect to new URL.
  - Reset and auto-detect behave.
- About screen:
  - Build info fields populate from status.

Notes
- Optionally add a mock server for offline testing; primary path is live LAN server.
- Capture any errors/logs for parity review.
