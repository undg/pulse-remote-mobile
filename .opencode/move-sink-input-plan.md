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
