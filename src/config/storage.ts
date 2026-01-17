import AsyncStorage from '@react-native-async-storage/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState, useCallback } from 'react'

const DEFAULTS = {
  hostname: '',
  port: '8448',
  endpoint: '/api/v1/ws',
  minVolume: 0,
  maxVolume: 150,
  stepVolume: 5,
  showMonitoredSources: true,
} as const

export type Config = typeof DEFAULTS & { serverUrl: string }

const STORAGE_KEY = 'pr-rn-config'

function deriveServerUrl(hostname: string, port: string, endpoint: string) {
  if (!hostname) return ''
  return `ws://${hostname}:${port}${endpoint}`
}

async function loadConfig(): Promise<Config> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const serverUrl = deriveServerUrl(DEFAULTS.hostname, DEFAULTS.port, DEFAULTS.endpoint)
      return { ...DEFAULTS, serverUrl }
    }
    const parsed = JSON.parse(raw)
    const hostname = typeof parsed.hostname === 'string' ? parsed.hostname : DEFAULTS.hostname
    const port = typeof parsed.port === 'string' ? parsed.port : DEFAULTS.port
    const endpoint = typeof parsed.endpoint === 'string' ? parsed.endpoint : DEFAULTS.endpoint
    const minVolume = Number.isFinite(parsed.minVolume) ? parsed.minVolume : DEFAULTS.minVolume
    const maxVolume = Number.isFinite(parsed.maxVolume) ? parsed.maxVolume : DEFAULTS.maxVolume
    const stepVolume = Number.isFinite(parsed.stepVolume) ? parsed.stepVolume : DEFAULTS.stepVolume
    const showMonitoredSources = typeof parsed.showMonitoredSources === 'boolean' ? parsed.showMonitoredSources : DEFAULTS.showMonitoredSources
    const serverUrl = deriveServerUrl(hostname, port, endpoint)
    return { hostname, port, endpoint, minVolume, maxVolume, stepVolume, showMonitoredSources, serverUrl }
  } catch (e) {
    const serverUrl = deriveServerUrl(DEFAULTS.hostname, DEFAULTS.port, DEFAULTS.endpoint)
    return { ...DEFAULTS, serverUrl }
  }
}

async function saveConfig(config: Config) {
  const { serverUrl, ...rest } = config
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
}

export function useConfig() {
  const [config, setConfig] = useState<Config>({ ...DEFAULTS, serverUrl: deriveServerUrl(DEFAULTS.hostname, DEFAULTS.port, DEFAULTS.endpoint) })
  const [loading, setLoading] = useState(true)
  const [serverUrl, setServerUrl] = useState(config.serverUrl)

  useEffect(() => {
    loadConfig().then(value => {
      setConfig(value)
      setServerUrl(value.serverUrl)
      setLoading(false)
    })
  }, [])

  const updateConfig = useCallback((partial: Partial<Omit<Config, 'serverUrl'>>) => {
    setConfig(prev => {
      const hostname = partial.hostname ?? prev.hostname
      const port = partial.port ?? prev.port
      const endpoint = partial.endpoint ?? prev.endpoint
      const minVolume = partial.minVolume ?? prev.minVolume
      const maxVolume = partial.maxVolume ?? prev.maxVolume
      const stepVolume = partial.stepVolume ?? prev.stepVolume
      const showMonitoredSources = partial.showMonitoredSources ?? prev.showMonitoredSources
      const nextServerUrl = deriveServerUrl(hostname, port, endpoint)
      setServerUrl(nextServerUrl)
      const next = { hostname, port, endpoint, minVolume, maxVolume, stepVolume, showMonitoredSources, serverUrl: nextServerUrl }
      saveConfig(next)
      return next
    })
  }, [])

  const resetConfig = useCallback(() => {
    const nextServerUrl = deriveServerUrl(DEFAULTS.hostname, DEFAULTS.port, DEFAULTS.endpoint)
    const next = { ...DEFAULTS, serverUrl: nextServerUrl }
    setConfig(next)
    setServerUrl(nextServerUrl)
    saveConfig(next)
  }, [])

  return { config, serverUrl, loading, updateConfig, resetConfig }
}
