# Sinks screen plan (RN)

Goals
- Landing screen showing sinks with volume/mute controls and nested sink inputs.
- Support moving sink inputs between sinks.
- Optimistic updates + throttled sends via volume store.

UI layout
- List of sinks (FlatList/SectionList) ordered as received.
- Each sink row:
  - Volume slider with % label and mute toggle.
  - Nested list of sink inputs belonging to sinkId.
- Sink inputs rows:
  - Volume slider, mute toggle.
  - Drag handle or action menu to move to another sink.
- Haptics on slider commit/mute taps.

Interactions
- Slider change → optimistic volume update + throttled send (`setSinkVolume`, `setSinkInputVolume`).
- Mute toggle → optimistic flip + send (`toggleSinkMuted`, `toggleSinkInputMuted`).
- Move sink input:
  - Option A: long-press drag between sink groups (requires gesture/dnd lib like reanimated + gesture-handler + sortable list).
  - Option B: action sheet to select target sink; send `MoveSinkInput` and optimistically update sinkId.

States
- Loading: show spinner/placeholder until status arrives.
- Error: display websocket error and retry affordance.
- Empty: show message if no sinks.

Theming/UX
- Respect app theme; use shared components.
- Ensure sliders respect config min/max/step.
