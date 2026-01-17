# Parity check plan (RN vs web)

Areas to verify
- Feature coverage: sinks controls, sink inputs (volume/mute, move), sources controls, config options, about info.
- Interaction fidelity: optimistic updates, throttling, haptics (where applicable), navigation flow (sinks first).
- Visibility rules: monitored sources toggle, empty states.
- Theming: light/dark availability.
- Error/loading handling: similar feedback paths.

Process
- After RN implementation, run through the testing checklist vs web behaviors.
- Note any gaps (e.g., missing drag UI replaced by action sheet) and decide if acceptable.
- Capture follow-ups for UI polish or advanced interactions.
