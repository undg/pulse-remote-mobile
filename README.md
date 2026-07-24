# pulse-remote-mobile

React Native mobile client for [pulse-remote](https://github.com/undg/pulse-remote).

Control your Linux PC's PulseAudio/PipeWire volume from your phone or tablet.

## Features

- Connect to a pulse-remote backend over WebSocket
- Adjust sink, source, and sink-input volume
- Mute/unmute audio devices
- Save backend URL and configuration locally
- Cross-platform: iOS, Android, and web preview

## Requirements

- Node.js (LTS)
- npm
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) (installed locally by the project)
- Android Studio / Xcode simulators or a physical device with Expo Go

## Install

```bash
git clone https://github.com/undg/pulse-remote-mobile
cd pulse-remote-mobile
npm install
```

## Development

```bash
# Start the Expo development server
npm run start

# Or start directly for a specific platform
npm run android
npm run ios
npm run web
```

Open the Expo Go app on your device and scan the QR code shown in the terminal, or use the simulator.

## Backend

The app needs a running [pulse-remote](https://github.com/undg/pulse-remote) server.

```bash
# From the pulse-remote backend repo
make run
```

By default the server listens on `ws://localhost:8448/api/v1/ws`. Enter your PC's IP address in the mobile app's **Config** screen when testing from a real device.

## Type Generation

The API types are generated from the backend JSON schemas.

```bash
npm run types:gen
```

The backend must be running on `http://localhost:8448` for this to work.

## Testing

```bash
npm run test          # run all tests once
npm run test:watch    # run tests in watch mode
npm run test:one -- path/to/test.ts
```

## Build

```bash
# Build an Android APK locally with EAS
npm run build:android
```

For iOS builds, use EAS cloud builds or a local macOS environment.

## Project Structure

```
pulse-remote-mobile/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Route-level screens
│   ├── config/         # Config, storage, generated types
│   ├── state/          # Volume store and optimistic updates
│   └── ws/             # WebSocket client hook
├── App.tsx             # Entry component
└── index.ts            # Main entry point
```

## Related Projects

- [pulse-remote](https://github.com/undg/pulse-remote) — Go backend
- [pulse-remote-web](https://github.com/undg/pulse-remote-web) — Web interface
- [pulse-remote-desktop](https://github.com/undg/pulse-remote-desktop) — Desktop wrapper

## License

MIT
