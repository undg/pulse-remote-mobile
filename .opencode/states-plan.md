# Loading, error, empty states plan (RN)

Loading
- While connecting or before first status, show centered spinner/placeholder.
- Per-screen skeleton optional; keep light.

Error
- If websocket error/closed after retries, show message with retry button.
- Surface minimal error text; allow manual reconnect.

Empty
- Sinks: show message when `sinks` list is empty.
- Sources: show message when filtered sources list is empty.
- SinkInputs: show sub-message when a sink has no inputs.

Integration
- Consume connection status from WS client plan.
- Use shared `LoadingOrError`-like component adapted for RN.
