import { FlatList, View, Text, StyleSheet } from 'react-native'
import { useMemo } from 'react'
import { VolumeSlider } from 'components/VolumeSlider'
import { useConfig } from 'config/storage'
import { useVolumeStore } from 'state/volume'

export function SourcesScreen() {
  const { config, serverUrl, loading, hasUrl } = useConfig()
  const { sources, setSourceVolume, toggleSourceMuted } = useVolumeStore(serverUrl)

  const data = useMemo(() => {
    const filtered = (sources ?? []).filter(src => (config.showMonitoredSources ? true : !src.monitored))
    return filtered
  }, [sources, config.showMonitoredSources])

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading config...</Text>
      </View>
    )
  }

  if (!hasUrl || !serverUrl) {
    return (
      <View style={styles.center}>
        <Text>Please set a hostname in Config to connect.</Text>
      </View>
    )
  }

  if (!data.length) {
    return (
      <View style={styles.center}>
        <Text>No sources found.</Text>
      </View>
    )
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
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 16 },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f8fafc', gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
