# Websocket client plan (RN)

Goals
- Connect to `ws://<host>:<port><endpoint>` from config; no auth.
- Auto-reconnect with backoff; expose connection state.
- Send JSON messages matching `Action` union; helper `send(message: Message)`.
- Receive messages, parse JSON; route `GetStatus` payload to store; surface errors.
- Optional ping/pong keepalive if server expects it (not seen in web).

API sketch
- `useWebSocketClient(config) => { send, status, lastMessage, lastJson, reconnect, close }`.
- Status enum: Connecting | Open | Closing | Closed.
- Reconnect strategy: incremental backoff (e.g., 1s → 2s → 5s capped).
- Keep latest WebSocket ref; guard against duplicate connections.

Integration notes
- Update volume store on `GetStatus` payload (see `status-shape`).
- Use optimistic updates; block status overwrite while optimistic in flight if needed (like web’s `volStatusBlockAtom`).
- Consider throttling outgoing volume updates (shared util) to avoid server spam.
- Hook should accept config changes (host/port/endpoint) and reconnect when URL changes.
