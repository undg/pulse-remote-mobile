import { FlatList, View, Text, StyleSheet } from 'react-native'
import { useMemo, useEffect } from 'react'
import { VolumeSlider } from 'components/VolumeSlider'
import { useConfig } from 'config/storage'
import { useVolumeStore } from 'state/volume'

export function SinksScreen() {
  const { config, serverUrl, loading, hasUrl } = useConfig()
  const { sinks, sinkInputs, setSinkVolume, toggleSinkMuted, setSinkInputVolume, toggleSinkInputMuted, moveSinkInput, wsStatus } = useVolumeStore(serverUrl)

  useEffect(() => {
    // keep volume store fed when URL changes
  }, [serverUrl])

  const data = useMemo(() => sinks ?? [], [sinks])

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

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={data}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => {
        const children = sinkInputs?.filter(si => si.sinkId === item.id) ?? []
        return (
          <View style={styles.card}>
            <VolumeSlider
              label={item.label}
              volume={item.volume}
              muted={item.muted}
              min={config.minVolume}
              max={config.maxVolume}
              step={config.stepVolume}
              onToggleMute={() => toggleSinkMuted(item.name)}
              onChange={v => setSinkVolume(item.name, Math.round(v))}
              onCommit={v => setSinkVolume(item.name, Math.round(v))}
            >
              {children.map(child => (
                <View style={styles.child} key={child.id}>
                  <VolumeSlider
                    label={child.label}
                    volume={child.volume}
                    muted={child.muted}
                    min={config.minVolume}
                    max={config.maxVolume}
                    step={config.stepVolume}
                    onToggleMute={() => toggleSinkInputMuted(child.id)}
                    onChange={v => setSinkInputVolume(child.id, Math.round(v))}
                    onCommit={v => setSinkInputVolume(child.id, Math.round(v))}
                  />
                  <Text style={styles.moveHint}>Move via action sheet (todo)</Text>
                </View>
              ))}
            </VolumeSlider>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 16 },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f8fafc', gap: 12 },
  child: { marginTop: 8, paddingLeft: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  moveHint: { marginTop: 4, fontSize: 12, color: '#6b7280' },
})
