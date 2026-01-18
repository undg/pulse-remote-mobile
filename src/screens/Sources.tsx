import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useMemo } from 'react'
import { LoadingOrError } from 'components/LoadingOrError'
import { VolumeSlider } from 'components/VolumeSlider'
import { useConfig } from 'config/storage'
import { useVolumeStore } from 'state/volume'

export function SourcesScreen() {
  const { config, serverUrl, loading, hasUrl } = useConfig()
  const { sources, setSourceVolume, toggleSourceMuted, wsStatus, reconnect } = useVolumeStore(serverUrl)

  const data = useMemo(() => {
    const filtered = (sources ?? []).filter(src => (config.showMonitoredSources ? true : !src.monitored))
    return filtered
  }, [sources, config.showMonitoredSources])

  if (loading) {
    return <LoadingOrError loading />
  }

  if (!hasUrl || !serverUrl) {
    return <LoadingOrError error='Please set a hostname in Config to connect.' />
  }

  if (wsStatus === 'Closed' || wsStatus === 'Closing') {
    return <LoadingOrError error='Connection lost' onRetry={reconnect} />
  }

  if (!data.length) {
    return <LoadingOrError error='No sources found.' />
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={data}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <VolumeSlider
            label={item.label}
            volume={item.volume}
            muted={item.muted}
            min={config.minVolume}
            max={config.maxVolume}
            step={config.stepVolume}
            onToggleMute={() => toggleSourceMuted(item.name)}
            onChange={v => setSourceVolume(item.name, Math.round(v))}
            onCommit={v => setSourceVolume(item.name, Math.round(v))}
          />
          {item.monitored && !config.showMonitoredSources ? <Text style={styles.mutedFlag}>Hidden monitored source</Text> : null}
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 16 },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f8fafc', gap: 12 },
  mutedFlag: { fontSize: 12, color: '#6b7280' },
})
