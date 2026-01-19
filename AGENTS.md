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
Line 16: No additional env vars noted; if backend URL needed, check screens/config usage.
Line 17: Hot reload expected; restart Metro when updating native deps.
Line 18: Keep Metro running in project root.

## Testing

Line 19: No test scripts configured in package.json.
Line 20: No test frameworks set up (Jest/RTL not present).
Line 21: Running a single test is not applicable until a test runner is added.
Line 22: If adding tests, use Jest + React Native Testing Library; wire scripts `test`, `test -- --watch`, and `test -- <pattern>` for single-test runs.
Line 23: Do not add tests unless required by task.

## Linting / Formatting

Line 24: No lint/format scripts configured.
Line 25: Follow existing code style manually.
Line 26: Use single quotes for strings.
Line 27: Do not use semicolons (current files are semicolon-free).
Line 28: Prefer trailing commas only where naturally used by React Native style objects; current code mixes but mostly minimal.
Line 29: Keep indentation with two spaces.
Line 30: Avoid unnecessary blank lines; keep sections tight.
Line 31: Keep imports ordered: external packages first, then aliased project modules, then relative (not currently used), with React-related imports at top.
Line 32: Use `import type` for type-only imports to reduce bundle impact.
Line 33: Avoid default exports unless existing pattern requires (App uses default export; keep).
Line 34: Do not introduce eslint/prettier configs unless requested.

## EditorConfig

Line EC1: `.editorconfig` enforces utf-8, LF, 2-space indent, trims trailing whitespace, inserts final newline.
Line EC2: Markdown files keep trailing spaces (no trim) for readability.

## TypeScript Guidelines

Line 35: `strict` mode is on; satisfy all type checks.
Line 36: Prefer explicit types on public APIs (props, params, return types) when unclear.
Line 37: Use `React.ReactNode` for children.
Line 38: Use enums/union types from generated config where available (`Action`, `PrapiStatus`).
Line 39: Prefer `unknown` over `any`; only use `any` when interfacing with JSON or platform APIs (existing code uses `any` for parsed JSON in websockets—keep consistent).
Line 40: Narrow JSON inputs defensively before use.
Line 41: Use `const` over `let` when possible.

## React / Components

Line 42: Functional components with hooks only; no classes.
Line 43: Keep components small and focused.
Line 44: Props typing via object `Props` type alias; export functions named in PascalCase except default App.
Line 45: Use React Navigation v7 bottom tabs; keep screen names stable (`Sinks`, `Sources`, `Config`, `About`).
Line 46: Prefer inline styles via `StyleSheet.create`; keep style objects flat and concise.
Line 47: Use semantic names for styles (`center`, `container`, `headerRow`).
Line 48: Avoid inline anonymous functions inside render when simple handlers exist; however existing code uses inline arrow handlers—match current style.
Line 49: Keep UI text short and user-facing strings in plain English.
Line 50: Use `Pressable` for buttons; include accessible text.

## State / Hooks

Line 51: Custom hooks live in `src/state` and `src/ws`.
Line 52: Use `useCallback`/`useMemo` to stabilize functions/values when passed to children or used in dependencies.
Line 53: For mutable refs, use `useRef` to avoid rerenders (see `ws/client.ts`, `state/volume.ts`).
Line 54: When throttling/debouncing, prefer helper functions close to use site (see `throttle` in `state/volume.ts`).
Line 55: Keep dependency arrays explicit and exhaustive; lint is absent, so self-enforce.
Line 56: When copying objects for optimistic updates, deep-clone as needed (see JSON stringify clone in volume store).

## WebSocket Client

Line 57: `useWebSocketClient` handles status, reconnect, and JSON parsing.
Line 58: `lastJson` stores parsed payload when JSON parse succeeds; non-JSON messages ignored quietly.
Line 59: Reconnect with exponential-ish backoff `defaultBackoff = [1000, 2000, 5000]`.
Line 60: `send` stringifies non-string payloads; ensure payloads are serializable.
Line 61: Respect `enabled` flag to avoid connecting when URL empty.
Line 62: Cleanup timers and sockets on unmount; follow existing pattern when modifying.

## Volume Store (Prapi integration)

Line 63: `useVolumeStore(url, throttleMs)` drives sinks/sources state via websocket.
Line 64: Uses optimistic updates with a block window (`blocked` true until release timer runs).
Line 65: Throttles outbound messages (`THROTTLE_TIME = 100ms`, `RELEASE_OPTIMISTIC_TIME = 150ms`).
Line 66: Mutations send actions from `Action` enum; keep payload shapes aligned with backend.
Line 67: When adding actions, mirror optimistic update before send.
Line 68: Derived data includes sinks, sinkInputs, sources, buildInfo; keep returns stable.

## Error Handling

Line 69: Handle nullable state carefully; many values optional.
Line 70: Prefer early returns for loading/error states (see `LoadingOrError`).
Line 71: For JSON parsing, swallow errors only when payloads are optional; otherwise log minimally with `console.warn`.
Line 72: Avoid throwing in render paths; surface messages via UI where possible.
Line 73: Network/WebSocket errors should transition status to `Closing/Closed` and optionally schedule reconnect.

## Naming Conventions

Line 74: Components and hooks: PascalCase (`VolumeSlider`, `LoadingOrError`, `useVolumeStore`).
Line 75: Types/interfaces: PascalCase (`VolumeState`, `VolumeActions`).
Line 76: Functions/variables: camelCase.
Line 77: Constants: SCREAMING_SNAKE_CASE when shared (`RELEASE_OPTIMISTIC_TIME`).
Line 78: Files: PascalCase for components/screens; camelCase for modules like `storage.ts`.
Line 79: Avoid abbreviations unless well-known (URL, ID, WS).

## Imports

Line 80: Group imports with blank line separation only if distinct sections; current files keep minimal grouping.
Line 81: Use type-only imports when importing solely for types (`import type { GestureResponderEvent } ...`).
Line 82: Prefer named exports; default export only where project already uses it (App, screens components are named exports).
Line 83: Keep relative imports shallow; prefer path aliases defined in tsconfig.

## Styling / UI

Line 84: Use `StyleSheet.create` for styles; avoid dynamic styles unless needed.
Line 85: Keep consistent spacing and sizing; use numbers for RN styles.
Line 86: Colors currently inline hex; keep consistent palette (#22c55e green, #111827 button background, #f1f5f9 neutral, #fecdd3 muted background).
Line 87: Maintain layout gaps using `gap` property where supported.
Line 88: Keep text legible: font sizes 16+ where appropriate.

## Data / Storage

Line 89: Storage helper in `src/config/storage.ts`; prefer using AsyncStorage wrapper if present.
Line 90: Generated config resides in `src/config/generated`; avoid manual edits to generated files.
Line 91: When touching generated files, document source of truth and regeneration steps in PR/task notes.

## Navigation

Line 92: Bottom tabs configured in `App.tsx`; initial route `Sinks`.
Line 93: Screens exported from `src/screens`; maintain consistent names.
Line 94: If adding tabs, ensure icons/labels consistent and keep initialRoute logic updated.

## Accessibility / UX

Line 95: Provide accessible text for pressables; emojis acceptable for mute indicators (existing pattern).
Line 96: Keep loading/error messaging user-friendly; reuse `LoadingOrError` component where possible.

## Performance

Line 97: Use throttling/debouncing for frequent networked events (already present in volume store).
Line 98: Avoid unnecessary state copies; keep immutability for React state updates.
Line 99: Memoize derived values with `useMemo` when computation non-trivial.

## Logging

Line 100: Minimal logging currently; if adding, prefer `console.debug`/`console.warn` with concise context.
Line 101: Do not spam logs inside render or tight loops.

## File Organization

Line 102: Components under `src/components`.
Line 103: Screens under `src/screens`.
Line 104: State/hooks under `src/state` and `src/ws`.
Line 105: Config and generated types under `src/config`.
Line 106: Keep new files aligned with this structure.

## Working with Expo

Line 107: Use Expo-managed workflow commands only (no bare react-native commands unless converted).
Line 108: Metro handles module resolution with tsconfig paths; ensure restart after path alias changes.
Line 109: When adding native modules, confirm compatibility with Expo SDK 54.

## Dependencies

Line 110: React Native 0.81.5, React 19.1.0, Expo ~54.0.31.
Line 111: Navigation: `@react-navigation/native` and `@react-navigation/bottom-tabs` v7.
Line 112: Slider: `@react-native-community/slider`.
Line 113: Async storage: `@react-native-async-storage/async-storage`.

## Coding Style Quick Reference

Line 114: Strings: single quotes.
Line 115: No semicolons.
Line 116: Arrow functions preferred.
Line 117: Destructure props in function parameters.
Line 118: Return early for conditional UI.
Line 119: Keep components pure; side effects in hooks.

## Error Messages

Line 120: Keep user-visible errors short and clear (e.g., "Loading...", "Retry").
Line 121: Internal errors: log succinctly; avoid exposing stack traces to UI.

## Async Patterns

Line 122: Prefer `async`/`await` over promise chains.
Line 123: Handle cancellation/cleanup in `useEffect` cleanup where applicable.
Line 124: For timers, store refs and clear on unmount (see `ws/client.ts`).

## Adding Tests (when required)

Line 125: Set up Jest with `react-native/jest-preset` and RTL.
Line 126: Configure `jest.config.js` and `babel-jest` when introduced.
Line 127: Add npm scripts: `test`, `test:watch`, `test:one` using `--runTestsByPath <file>` for single test.
Line 128: Use `@testing-library/react-native` for component tests; mock AsyncStorage and navigation.

## Review Checklist for Agents

Line 129: Confirm commands in this file still match package.json before edits.
Line 130: Honor style rules (single quotes, no semicolons, type imports).
Line 131: Avoid editing generated files directly.
Line 132: Keep imports organized and minimal.
Line 133: Ensure hooks dependency arrays are correct.
Line 134: Validate optimistic updates mirror server expectations.
Line 135: Keep WebSocket cleanup/reconnect logic intact when modifying.
Line 136: Maintain TypeScript strictness; no `any` unless necessary.
Line 137: Keep UI states (loading/error/empty) handled gracefully.
Line 138: Match existing color palette and spacing.
Line 139: Update this AGENTS.md if tooling/commands change.

## Final Notes

Line 140: No existing lint/test automation—manual verification required.
Line 141: If you add tooling, document commands here.
Line 142: Keep responses concise for future agents.
Line 143: Respect repository privacy; no external calls without approval.
Line 144: Prefer minimal diffs focused on the task.
Line 145: Do not add license headers.
Line 146: Do not commit unless explicitly requested by user.
Line 147: When uncertain, ask for clarification before large changes.
Line 148: Keep this file around ~150 lines; adjust as project evolves.
Line 149: End of AGENTS instructions.
Line 150: Thank you, future agent.
