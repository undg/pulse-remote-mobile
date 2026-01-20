const { AndroidConfig, withAndroidManifest, withDangerousMod } = require('@expo/config-plugins')
const { Paths } = require('@expo/config-plugins/build/android')
const fs = require('fs')
const path = require('path')

const { getMainApplicationOrThrow } = AndroidConfig.Manifest

const NETWORK_SECURITY_CONFIG_NAME = 'network_security_config.xml'
const TOOLS_NAMESPACE = 'http://schemas.android.com/tools'

const ensureResXmlExistsAsync = async (projectRoot, configFilePath) => {
  const resXmlDir = path.resolve(configFilePath, '..')
  if (!fs.existsSync(resXmlDir)) {
    await fs.promises.mkdir(resXmlDir, { recursive: true })
  }
}

const copyNetworkSecurityConfigAsync = async (projectRoot) => {
  const srcFilePath = path.join(__dirname, NETWORK_SECURITY_CONFIG_NAME)
  const resFilePath = path.join(
    await Paths.getResourceFolderAsync(projectRoot),
    'xml',
    NETWORK_SECURITY_CONFIG_NAME
  )

  await ensureResXmlExistsAsync(projectRoot, resFilePath)
  await fs.promises.copyFile(srcFilePath, resFilePath)
}

const setNetworkSecurityConfig = (modResults) => {
  const mainApplication = getMainApplicationOrThrow(modResults)
  const androidManifest = modResults.manifest

  androidManifest.$ = {
    ...androidManifest.$,
    'xmlns:tools': TOOLS_NAMESPACE,
  }

  mainApplication['tools:replace'] = 'android:usesCleartextTraffic, android:networkSecurityConfig'
  mainApplication['android:usesCleartextTraffic'] = 'true'
  mainApplication['android:networkSecurityConfig'] = `@xml/${NETWORK_SECURITY_CONFIG_NAME.replace('.xml', '')}`

  return modResults
}

const withCleartextTrafficDev = (config, shouldEnableCleartext = false) => {
  if (!shouldEnableCleartext) {
    return config
  }

  config = withDangerousMod(config, ['android', async (config) => {
    await copyNetworkSecurityConfigAsync(config.modRequest.projectRoot)
    return config
  }])

  config = withAndroidManifest(config, async (config) => {
    config.modResults = setNetworkSecurityConfig(config.modResults)
    return config
  })

  return config
}

module.exports = withCleartextTrafficDev
