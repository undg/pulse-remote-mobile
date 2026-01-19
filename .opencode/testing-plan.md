# Testing plan (LAN pulse-remote server)

Scope
- Validate main flows against a running pulse-remote server on LAN.

Unit tests (start here)
- [x] Theme provider resolves system/light/dark and persists preference
- [x] Config store loads defaults, saves overrides, derives ws URL
- [x] Websocket client parses JSON, handles status transitions, backoff
- [x] Volume store optimistic update/releases mirror actions (SetSinkVolume/mute/input)
- [x] LoadingOrError renders loading, error, retry callback
- [ ] About screen renders build info from status payload

Integration/UI smoke
- [x] App tabs render and show initial empty state
- [ ] Sinks screen renders sinks list, move prompt shows options
- [ ] Sources screen respects showMonitoredSources toggle
- [ ] Config screen updates host/port/endpoint and triggers reconnect
- [ ] Error state shows reconnect CTA when ws closed

LAN manual checklist
- [ ] Connect over websocket: status becomes Open; initial `GetStatus` received.
- [ ] Sinks screen: adjust sink volume → server receives `SetSinkVolume`; state reflects change.
- [ ] Sinks screen: toggle sink mute → `SetSinkMuted` sent; state reflects change.
- [ ] Sinks screen: adjust sink input volume/mute → corresponding actions sent; reflected.
- [ ] Sinks screen: move sink input to another sink → `MoveSinkInput` sent; status updates.
- [ ] Sources screen: adjust source volume/mute → `SetSourceVolume` / `SetSourceMuted` sent.
- [ ] Sources screen: Config `showMonitoredSources` toggles visibility.
- [ ] Config screen: Host/port/endpoint updates cause reconnect to new URL.
- [ ] Config screen: Reset and auto-detect behave.
- [ ] About screen: Build info fields populate from status.

Notes
- Optionally add a mock server for offline testing; primary path is live LAN server.
- Capture any errors/logs for parity review.

