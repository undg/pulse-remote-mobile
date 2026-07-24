# AGENTS

Scope: applies to all files in `/home/undg/Code/pulse-remote-mobile` unless a deeper AGENTS.md is added later.

Line 0: .opencode/plan.json have list of steps to implement.
Line 0-1: when step is complete, mark is as done and provide summary for the user that he can use as a commit message.
Line 1: Use this file as the canonical guide for agent work in this repo.
Line 2: No other AGENTS.md files exist yet.
Line 3: No Cursor rules found (.cursor/rules, .cursorrules missing).
Line 4: No Copilot instructions file found (.github/copilot-instructions.md missing).
Line 5: Keep instructions concise for future agents.
Line 6: Expo React Native project using TypeScript.
Line 7: Main entry: `index.ts` -> `App.tsx` (expo).
Line 8: TS config extends `expo/tsconfig.base`, strict mode enabled.
Line 9: Path aliases: `config/*`, `config/generated/*`, `ws/*`, `state/*`, `screens/*`, `components/*`.
Line 10: Private app (no publishing assumptions).

## Build / Run / Dev

Line 11: Install deps with `npm install` (lockfile present).
Line 12: Start dev server: `npm run start` (Expo Metro).
Line 13: Android simulator/device: `npm run android`.
Line 14: iOS simulator/device: `npm run ios`.
Line 15: Web preview: `npm run web`.
Line 16: Type generation from backend schemas: `npm run types:gen` (backend must run on localhost:8448).
Line 17: No additional env vars noted; if backend URL needed, check screens/config usage.
Line 18: Hot reload expected; restart Metro when updating native deps.
Line 19: Keep Metro running in project root.

## Testing

Line 20: Test runner is Jest via `jest-expo`.
Line 21: Run tests: `npm run test`.
Line 22: Watch mode: `npm run test:watch`.
Line 23: Run single test: `npm run test:one -- <path>`.
Line 24: Do not add tests unless required by task.

## Linting / Formatting

Line 25: No lint/format scripts configured.
Line 26: Follow existing code style manually.
Line 27: Use single quotes for strings.
Line 28: Do not use semicolons (current files are semicolon-free).
Line 29: Prefer trailing commas only where naturally used by React Native style objects; current code mixes but mostly minimal.
Line 30: Keep indentation with two spaces.
Line 31: Avoid unnecessary blank lines; keep sections tight.
Line 32: Keep imports ordered: external packages first, then aliased project modules, then relative (not currently used), with React-related imports at top.
Line 33: Use `import type` for type-only imports to reduce bundle impact.
Line 34: Avoid default exports unless existing pattern requires (App uses default export; keep).
Line 35: Do not introduce eslint/prettier configs unless requested.

## EditorConfig

Line EC1: `.editorconfig` enforces utf-8, LF, 2-space indent, trims trailing whitespace, inserts final newline.
Line EC2: Markdown files keep trailing spaces (no trim) for readability.

## TypeScript Guidelines

Line 36: `strict` mode is on; satisfy all type checks.
Line 37: Prefer explicit types on public APIs (props, params, return types) when unclear.
Line 38: Use `React.ReactNode` for children.
Line 39: Use enums/union types from generated config where available (`Action`, `PrapiStatus`).
Line 40: Prefer `unknown` over `any`; only use `any` when interfacing with JSON or platform APIs (existing code uses `any` for parsed JSON in websockets—keep consistent).
Line 41: Narrow JSON inputs defensively before use.
Line 42: Use `const` over `let` when possible.

## React / Components

Line 43: Functional components with hooks only; no classes.
Line 44: Keep components small and focused.
Line 45: Props typing via object `Props` type alias; export functions named in PascalCase except default App.
Line 46: Use React Navigation v7 bottom tabs; keep screen names stable (`Sinks`, `Sources`, `Config`, `About`).
Line 47: Prefer inline styles via `StyleSheet.create`; keep style objects flat and concise.
Line 48: Use semantic names for styles (`center`, `container`, `headerRow`).
Line 49: Avoid inline anonymous functions inside render when simple handlers exist; however existing code uses inline arrow handlers—match current style.
Line 50: Keep UI text short and user-facing strings in plain English.
Line 51: Use `Pressable` for buttons; include accessible text.

## State / Hooks

Line 52: Custom hooks live in `src/state` and `src/ws`.
Line 53: Use `useCallback`/`useMemo` to stabilize functions/values when passed to children or used in dependencies.
Line 54: For mutable refs, use `useRef` to avoid rerenders (see `ws/client.ts`, `state/volume.ts`).
Line 55: When throttling/debouncing, prefer helper functions close to use site (see `throttle` in `state/volume.ts`).
Line 56: Keep dependency arrays explicit and exhaustive; lint is absent, so self-enforce.
Line 57: When copying objects for optimistic updates, deep-clone as needed (see JSON stringify clone in volume store).

## WebSocket Client

Line 58: `useWebSocketClient` handles status, reconnect, and JSON parsing.
Line 59: `lastJson` stores parsed payload when JSON parse succeeds; non-JSON messages ignored quietly.
Line 60: Reconnect with exponential-ish backoff `defaultBackoff = [1000, 2000, 5000]`.
Line 61: `send` stringifies non-string payloads; ensure payloads are serializable.
Line 62: Respect `enabled` flag to avoid connecting when URL empty.
Line 63: Cleanup timers and sockets on unmount; follow existing pattern when modifying.

## Volume Store (Prapi integration)

Line 64: `useVolumeStore(url, throttleMs)` drives sinks/sources state via websocket.
Line 65: Uses optimistic updates with a block window (`blocked` true until release timer runs).
Line 66: Throttles outbound messages (`THROTTLE_TIME = 100ms`, `RELEASE_OPTIMISTIC_TIME = 150ms`).
Line 67: Mutations send actions from `Action` enum; keep payload shapes aligned with backend.
Line 68: When adding actions, mirror optimistic update before send.
Line 69: Derived data includes sinks, sinkInputs, sources, buildInfo; keep returns stable.

## Error Handling

Line 70: Handle nullable state carefully; many values optional.
Line 71: Prefer early returns for loading/error states (see `LoadingOrError`).
Line 72: For JSON parsing, swallow errors only when payloads are optional; otherwise log minimally with `console.warn`.
Line 73: Avoid throwing in render paths; surface messages via UI where possible.
Line 74: Network/WebSocket errors should transition status to `Closing/Closed` and optionally schedule reconnect.

## Naming Conventions

Line 75: Components and hooks: PascalCase (`VolumeSlider`, `LoadingOrError`, `useVolumeStore`).
Line 76: Types/interfaces: PascalCase (`VolumeState`, `VolumeActions`).
Line 77: Functions/variables: camelCase.
Line 78: Constants: SCREAMING_SNAKE_CASE when shared (`RELEASE_OPTIMISTIC_TIME`).
Line 79: Files: PascalCase for components/screens; camelCase for modules like `storage.ts`.
Line 80: Avoid abbreviations unless well-known (URL, ID, WS).

## Imports

Line 81: Group imports with blank line separation only if distinct sections; current files keep minimal grouping.
Line 82: Use type-only imports when importing solely for types (`import type { GestureResponderEvent } ...`).
Line 83: Prefer named exports; default export only where project already uses it (App, screens components are named exports).
Line 84: Keep relative imports shallow; prefer path aliases defined in tsconfig.

## Styling / UI

Line 85: Use `StyleSheet.create` for styles; avoid dynamic styles unless needed.
Line 86: Keep consistent spacing and sizing; use numbers for RN styles.
Line 87: Colors currently inline hex; keep consistent palette (#22c55e green, #111827 button background, #f1f5f9 neutral, #fecdd3 muted background).
Line 88: Maintain layout gaps using `gap` property where supported.
Line 89: Keep text legible: font sizes 16+ where appropriate.

## Data / Storage

Line 90: Storage helper in `src/config/storage.ts`; prefer using AsyncStorage wrapper if present.
Line 91: Generated config resides in `src/config/generated`; avoid manual edits to generated files.
Line 92: When touching generated files, document source of truth and regeneration steps in PR/task notes.

## Navigation

Line 93: Bottom tabs configured in `App.tsx`; initial route `Sinks`.
Line 94: Screens exported from `src/screens`; maintain consistent names.
Line 95: If adding tabs, ensure icons/labels consistent and keep initialRoute logic updated.

## Accessibility / UX

Line 96: Provide accessible text for pressables; emojis acceptable for mute indicators (existing pattern).
Line 97: Keep loading/error messaging user-friendly; reuse `LoadingOrError` component where possible.

## Performance

Line 98: Use throttling/debouncing for frequent networked events (already present in volume store).
Line 99: Avoid unnecessary state copies; keep immutability for React state updates.
Line 100: Memoize derived values with `useMemo` when computation non-trivial.

## Logging

Line 101: Minimal logging currently; if adding, prefer `console.debug`/`console.warn` with concise context.
Line 102: Do not spam logs inside render or tight loops.

## File Organization

Line 103: Components under `src/components`.
Line 104: Screens under `src/screens`.
Line 105: State/hooks under `src/state` and `src/ws`.
Line 106: Config and generated types under `src/config`.
Line 107: Keep new files aligned with this structure.

## Working with Expo

Line 108: Use Expo-managed workflow commands only (no bare react-native commands unless converted).
Line 109: Metro handles module resolution with tsconfig paths; ensure restart after path alias changes.
Line 110: When adding native modules, confirm compatibility with Expo SDK 54.

## Dependencies

Line 111: React Native 0.81.5, React 19.1.0, Expo ~54.0.31.
Line 112: Navigation: `@react-navigation/native` and `@react-navigation/bottom-tabs` v7.
Line 113: Slider: `@react-native-community/slider`.
Line 114: Async storage: `@react-native-async-storage/async-storage`.

## Coding Style Quick Reference

Line 115: Strings: single quotes.
Line 116: No semicolons.
Line 117: Arrow functions preferred.
Line 118: Destructure props in function parameters.
Line 119: Return early for conditional UI.
Line 120: Keep components pure; side effects in hooks.

## Error Messages

Line 121: Keep user-visible errors short and clear (e.g., "Loading...", "Retry").
Line 122: Internal errors: log succinctly; avoid exposing stack traces to UI.

## Async Patterns

Line 123: Prefer `async`/`await` over promise chains.
Line 124: Handle cancellation/cleanup in `useEffect` cleanup where applicable.
Line 125: For timers, store refs and clear on unmount (see `ws/client.ts`).

## Adding Tests (when required)

Line 126: Set up Jest with `react-native/jest-preset` and RTL.
Line 127: Configure `jest.config.js` and `babel-jest` when introduced.
Line 128: Single test script `npm run test:one -- <path>` already exists.
Line 129: Use `@testing-library/react-native` for component tests; mock AsyncStorage and navigation.

## Review Checklist for Agents

Line 130: Confirm commands in this file still match package.json before edits.
Line 131: Honor style rules (single quotes, no semicolons, type imports).
Line 132: Avoid editing generated files directly.
Line 133: Keep imports organized and minimal.
Line 134: Ensure hooks dependency arrays are correct.
Line 135: Validate optimistic updates mirror server expectations.
Line 136: Keep WebSocket cleanup/reconnect logic intact when modifying.
Line 137: Maintain TypeScript strictness; no `any` unless necessary.
Line 138: Keep UI states (loading/error/empty) handled gracefully.
Line 139: Match existing color palette and spacing.
Line 140: Update this AGENTS.md if tooling/commands change.

## Final Notes

Line 141: No existing lint automation—manual verification required.
Line 142: If you add tooling, document commands here.
Line 143: Keep responses concise for future agents.
Line 144: Respect repository privacy; no external calls without approval.
Line 145: Prefer minimal diffs focused on the task.
Line 146: Do not add license headers.
Line 147: Do not commit unless explicitly requested by user.
Line 148: When uncertain, ask for clarification before large changes.
Line 149: Keep this file around ~150 lines; adjust as project evolves.
Line 150: End of AGENTS instructions.
Line 151: Thank you, future agent.
