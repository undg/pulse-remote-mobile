# Sources screen plan (RN)

Goals
- List sources with volume/mute controls.
- Respect config flag to hide monitored sources.
- Optimistic updates + throttled sends via volume store.

UI layout
- FlatList of sources.
- Each row: label, volume slider (min/max/step from config), mute toggle, % label.

Interactions
- Slider change → optimistic volume update + throttled send (`setSourceVolume`).
- Mute toggle → optimistic flip + send (`toggleSourceMuted`).
- Filter: hide items where `monitored` is true if config.showMonitoredSources is false.

States
- Loading: placeholder until status arrives.
- Empty: message when no sources after filter.

UX notes
- Haptics on mute/commit if desired.
- Share components with sinks (slider, buttons, typography).
