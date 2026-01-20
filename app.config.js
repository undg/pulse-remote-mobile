const useCleartextTraffic = (process.env.USE_CLEARTEXT_TRAFFIC || 'true').toLowerCase() === 'true'

module.exports = () => {
  const androidConfig = {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.undg.pulseremote',
  }

  if (useCleartextTraffic) {
    androidConfig.usesCleartextTraffic = true
    androidConfig.networkSecurityConfig = './network_security_config.xml'
  }

  return {
    expo: {
      name: 'pulse-remote-mobile',
      slug: 'pulse-remote-mobile',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './assets/icon.png',
      userInterfaceStyle: 'light',
      newArchEnabled: true,
      splash: {
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.undg.pulseremote',
      },
      android: androidConfig,
      web: {
        favicon: './assets/favicon.png',
      },
      extra: {
        eas: {
          projectId: '4d71173a-7b95-4aa3-a560-f7d49c1252ac',
        },
      },
      plugins: [
        ['./plugins/withCleartextTrafficDev', useCleartextTraffic],
        'expo-font',
      ],
    },
  }
}
