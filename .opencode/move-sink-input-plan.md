# Move sink-input interaction plan (RN)

Goal
- Allow reassigning a sink input (app) to another sink.

Options
- **Drag & drop**: Long-press draggable items (sink inputs) and drop onto sink cards.
  - Requires `react-native-gesture-handler` + `react-native-reanimated` + a DnD helper (e.g., `@shopify/flash-list` with custom gesture) or libraries like `react-native-draggable-flatlist` with custom drop zones.
  - More effort; richer UX.
- **Action menu** (recommended for first pass):
  - Tap a sink input row → action sheet or modal select listing available sinks; choose target → optimistic update sinkId; send `MoveSinkInput`.
  - Simpler, consistent across platforms.

Implementation notes
- On choose target sink:
  - Optimistic: update sinkInput.sinkId in store.
  - Send `{ action: MoveSinkInput, payload: { name: targetSinkName, id } }`.
  - Ensure target list excludes current sink.
  - Provide feedback (toast/snackbar) on error and revert if needed.

Future drag & drop spec (add after action-sheet MVP)
- Install deps: `react-native-gesture-handler`, `react-native-reanimated` (Expo compatible), and a sortable list helper (e.g., `react-native-draggable-flatlist`) or custom gesture layer.
- Interaction: long-press a sink input row to start drag; allow vertical drag within a list and horizontal/target-zone detection to drop over another sink card.
- Visuals: lift effect + shadow while dragging; highlight potential target sink; show placeholder in source list.
- Logic: on drop, compute target sinkId; optimistically set `sinkInput.sinkId` to target; send `MoveSinkInput` with target sink name and input id; cancel drop keeps original sinkId.
- Edge cases: prevent dropping onto same sink; handle disconnects (disable drag when wsStatus !== 'Open'); throttle multiple drops; ensure accessibility fallbacks (action sheet remains available).

