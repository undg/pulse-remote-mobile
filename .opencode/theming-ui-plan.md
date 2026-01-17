# Theming and reusable UI primitives plan (RN)

Theming
- Light/dark theme support; integrate with RN Navigation theme.
- Persist theme choice locally (same store as config or separate).
- Use React Native Paper/NativeWind or custom tokens; keep minimal.

Primitives
- Button, Toggle, Slider, Input, Switch, Text variants—reuse across sinks/sources/config/about.
- Slider: supports min/max/step, thumb label showing %, horizontal layout.
- Toggle: for mute states.
- Layout containers with padding and background aligned to theme.

Haptics
- Optional haptics on slider commit and mute toggles.

Approach
- Start with small custom primitives styled via StyleSheet/Tailwind-like utility; avoid over-complexity.
- Ensure accessibility labels for buttons/toggles.
