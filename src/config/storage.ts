import RNAsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useCallback, useSyncExternalStore } from "react";

const DEFAULTS = {
  hostname: "192.168.1.244",
  port: "8448",
  endpoint: "/api/v1/ws",
  minVolume: 0,
  maxVolume: 150,
  stepVolume: 5,
  showMonitoredSources: true,
};

export type Config = {
  hostname: string;
  port: string;
  endpoint: string;
  minVolume: number;
  maxVolume: number;
  stepVolume: number;
  showMonitoredSources: boolean;
  serverUrl: string;
};

type ConfigState = {
  config: Config;
  serverUrl: string;
  hasUrl: boolean;
  loading: boolean;
};

const STORAGE_KEY = "pr-rn-config";

function deriveServerUrl(hostname: string, port: string, endpoint: string) {
  if (!hostname) return "";
  return `ws://${hostname}:${port}${endpoint}`;
}

const initialServerUrl = deriveServerUrl(
  DEFAULTS.hostname,
  DEFAULTS.port,
  DEFAULTS.endpoint,
);
let sharedState: ConfigState = {
  config: { ...DEFAULTS, serverUrl: initialServerUrl },
  serverUrl: initialServerUrl,
  hasUrl: Boolean(DEFAULTS.hostname),
  loading: true,
};
let loadingPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

async function loadConfig(): Promise<Config> {
  try {
    const raw = await RNAsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const serverUrl = deriveServerUrl(
        DEFAULTS.hostname,
        DEFAULTS.port,
        DEFAULTS.endpoint,
      );
      return { ...DEFAULTS, serverUrl };
    }
    const parsed = JSON.parse(raw);
    const hostname =
      typeof parsed.hostname === "string" ? parsed.hostname : DEFAULTS.hostname;
    const port = typeof parsed.port === "string" ? parsed.port : DEFAULTS.port;
    const endpoint =
      typeof parsed.endpoint === "string" ? parsed.endpoint : DEFAULTS.endpoint;
    const minVolume = Number.isFinite(parsed.minVolume)
      ? parsed.minVolume
      : DEFAULTS.minVolume;
    const maxVolume = Number.isFinite(parsed.maxVolume)
      ? parsed.maxVolume
      : DEFAULTS.maxVolume;
    const stepVolume = Number.isFinite(parsed.stepVolume)
      ? parsed.stepVolume
      : DEFAULTS.stepVolume;
    const showMonitoredSources =
      typeof parsed.showMonitoredSources === "boolean"
        ? parsed.showMonitoredSources
        : DEFAULTS.showMonitoredSources;
    const serverUrl = deriveServerUrl(hostname, port, endpoint);
    return {
      hostname,
      port,
      endpoint,
      minVolume,
      maxVolume,
      stepVolume,
      showMonitoredSources,
      serverUrl,
    };
  } catch (e) {
    const serverUrl = deriveServerUrl(
      DEFAULTS.hostname,
      DEFAULTS.port,
      DEFAULTS.endpoint,
    );
    return { ...DEFAULTS, serverUrl };
  }
}

async function saveConfig(config: Config) {
  const { serverUrl, ...rest } = config;
  await RNAsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
}

function setSharedState(next: ConfigState) {
  sharedState = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return sharedState;
}

export function useConfig() {
  useEffect(() => {
    if (!sharedState.loading && !loadingPromise) return;
    if (!loadingPromise) {
      loadingPromise = loadConfig()
        .then((value) => {
          setSharedState({
            config: value,
            serverUrl: value.serverUrl,
            hasUrl: Boolean(value.hostname),
            loading: false,
          });
        })
        .finally(() => {
          loadingPromise = null;
        });
    }
  }, []);

  const { config, serverUrl, hasUrl, loading } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  const updateConfig = useCallback(
    (partial: Partial<Omit<Config, "serverUrl">>) => {
      const prev = sharedState.config;
      const hostname = partial.hostname ?? prev.hostname;
      const port = partial.port ?? prev.port;
      const endpoint = partial.endpoint ?? prev.endpoint;
      const minVolume = partial.minVolume ?? prev.minVolume;
      const maxVolume = partial.maxVolume ?? prev.maxVolume;
      const stepVolume = partial.stepVolume ?? prev.stepVolume;
      const showMonitoredSources =
        partial.showMonitoredSources ?? prev.showMonitoredSources;
      const nextServerUrl = deriveServerUrl(hostname, port, endpoint);
      const next: Config = {
        hostname,
        port,
        endpoint,
        minVolume,
        maxVolume,
        stepVolume,
        showMonitoredSources,
        serverUrl: nextServerUrl,
      };
      setSharedState({
        config: next,
        serverUrl: nextServerUrl,
        hasUrl: Boolean(hostname),
        loading: false,
      });
      saveConfig(next);
    },
    [],
  );

  const resetConfig = useCallback(() => {
    const nextServerUrl = deriveServerUrl(
      DEFAULTS.hostname,
      DEFAULTS.port,
      DEFAULTS.endpoint,
    );
    const next: Config = { ...DEFAULTS, serverUrl: nextServerUrl };
    setSharedState({
      config: next,
      serverUrl: nextServerUrl,
      hasUrl: Boolean(next.hostname),
      loading: false,
    });
    saveConfig(next);
  }, []);

  return { config, serverUrl, loading, hasUrl, updateConfig, resetConfig };
}
