# Cleartext traffic support plan (Android Metro)

Goal

- Allow cleartext (HTTP) traffic for Metro bundler on Android 9+ so development over LAN works without TLS.

Approach

- Implement an Expo config plugin that injects a network security config and enables cleartext for the app when building debug/development variants.
- Base implementation on the steps from https://medium.com/amperias/how-to-enable-cleartext-traffic-for-metro-bundler-on-android-9-0-270d9cd6eaca adapted for Expo managed workflow.

Tasks

- Add expo config plugin under `plugins/` to:
  - Generate `android/app/src/main/res/xml/network_security_config.xml` allowing cleartext on localhost/LAN hosts (e.g., 10.0.2.2/127.0.0.1/192.168.1.0) for debug.
  - Update `AndroidManifest.xml` via config to reference the security config and set `android:usesCleartextTraffic="true"` for the application.
  - Ensure plugin runs only for Android and respects existing manifest settings.
- Wire plugin in `app.json` / `app.config.js` so Expo applies it during prebuild.
- Document usage and rationale in this plan; implementation files to live under `plugins/` and any helper `config/*.ts` as needed.

Reference snippets (from Medium article)

- `plugins/network_security_config.xml`

```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <base-config cleartextTrafficPermitted="true"></base-config>
</network-security-config>
```

- `plugins/withCleartextTrafficDev.js`

```
const { AndroidConfig, withAndroidManifest } = require('@expo/config-plugins')
const { Paths } = require('@expo/config-plugins/build/android')
const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises
const { getMainApplicationOrThrow } = AndroidConfig.Manifest

async function setCustomConfigAsync(config, modResults) {
  const srcFilePath = path.join(__dirname, 'network_security_config.xml')
  const resFilePath = path.join(
    await Paths.getResourceFolderAsync(config.modRequest.projectRoot),
    'xml',
    'network_security_config.xml'
  )
  const resDir = path.resolve(resFilePath, '..')
  if (!fs.existsSync(resDir)) {
    await fsPromises.mkdir(resDir)
  }
  await fsPromises.copyFile(srcFilePath, resFilePath)
  const mainApplication = getMainApplicationOrThrow(modResults)
  const androidManifest = modResults.manifest
  androidManifest.$ = {
    ...androidManifest.$,
    'xmlns:tools': 'http://schemas.android.com/tools',
  }
  mainApplication['tools:replace'] =
    'android:usesCleartextTraffic, android:networkSecurityConfig'
  mainApplication['android:usesCleartextTraffic'] = 'true'
  mainApplication['android:networkSecurityConfig'] =
    '@xml/network_security_config'
  return modResults
}

const withCleartextTrafficDev = (config, shouldUseCleartextTraffic) =>
  withAndroidManifest(config, async config => {
    if (shouldUseCleartextTraffic) {
      config.modResults = await setCustomConfigAsync(config, config.modResults)
    }
    return config
  })

module.exports = withCleartextTrafficDev
```

- Example usage in `app.config.js`/`app.json`

```
const shouldAllowCleartextTraffic =
  (process.env.USE_CLEARTEXT_TRAFFIC || '').toLowerCase() === 'true'

module.exports = {
  expo: {
    ...
    plugins: [
      ['./plugins/withCleartextTrafficDev', shouldAllowCleartextTraffic],
    ],
  },
}
```

Acceptance

- Running `npx expo prebuild --platform android` (or actual Android build) results in manifest containing `usesCleartextTraffic="true"` and `android:networkSecurityConfig="@xml/network_security_config"`.
- Generated security config allows HTTP access to Metro during development without impacting release builds unnecessarily.
- Plan recorded in `.opencode/plan.json` step "Enable Android cleartext for Metro via expo plugin per cleartext-plan.md".
