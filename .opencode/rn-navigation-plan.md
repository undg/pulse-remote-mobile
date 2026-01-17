# RN navigation plan (sinks landing)

- Use React Navigation.
  - Stack: root stack to host modal-ish screens if needed (e.g., config modal), else single tab container.
  - Bottom tabs (or top tabs) with four routes: `Sinks` (initial), `Sources`, `Config`, `About`.
- Initial route: `Sinks` (matches web landing).
- Screen intents:
  - `Sinks`: list sinks with nested sink inputs and controls.
  - `Sources`: list sources with controls.
  - `Config`: edit host/port/endpoint, volume limits, show-monitors toggle.
  - `About`: server info and app info.
- Navigation params: none needed (all data from shared store/websocket).
- Theming: hook into RN Navigation theme to reflect light/dark (optional later step).
