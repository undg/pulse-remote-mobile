# Websocket actions and payload types

Source: `pulse-remote-web/src/generated/message.ts`, `pulse-remote-web/src/api/types.ts`.

## Actions (enum `Action`)
- `GetBuildInfo`
- `GetStatus`
- `MoveSinkInput`
- `MoveSourceOutput`
- `SetSinkInputMuted`
- `SetSinkInputVolume`
- `SetSinkMuted`
- `SetSinkVolume`
- `SetSourceInputMuted`
- `SetSourceInputVolume`
- `SetSourceMuted`
- `SetSourceVolume`

## Outgoing message shapes (client → server)
- `MessageGetStatus`: `{ action: Action.GetStatus }
- `MessageGetBuildInfo`: `{ action: Action.GetBuildInfo }
- `MessageSetSinkVolume`: `{ action: Action.SetSinkVolume, payload: { name, volume } }
- `MessageSetSinkMuted`: `{ action: Action.SetSinkMuted, payload: { name, muted } }
- `MessageSetSinkInputVolume`: `{ action: Action.SetSinkInputVolume, payload: { id, volume } }
- `MessageSetSinkInputMuted`: `{ action: Action.SetSinkInputMuted, payload: { id, muted } }
- `MessageMoveSinkInput`: `{ action: Action.MoveSinkInput, payload: { name, id } }`
- `MessageSetSourceVolume`: `{ action: Action.SetSourceVolume, payload: { name, volume } }`
- `MessageSetSourceMuted`: `{ action: Action.SetSourceMuted, payload: { name, muted } }`
- (Also `SetSourceInputMuted/Volume`, `MoveSourceOutput` exist in enum; not used in web UI now.)

## Incoming message (server → client)
- `IncomingMessage`: `{ action: 'GetStatus', status: number, payload?: PrapiStatus, error?: string }`
  - Web app currently expects `action === 'GetStatus'` with `payload` to refresh state.

## Implementation notes for RN
- Build a WS client that can send JSON-serialized `Message` union above and handle `GetStatus` updates.
- Include auto-reconnect and optional ping/pong keepalive.
- Keep optimistic updates aligned with actual enum/action names; reuse generated types if ported.
