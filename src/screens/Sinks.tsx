import { FlatList, View, Text, StyleSheet, Pressable, Alert, ActionSheetIOS, Platform } from 'react-native'
import { useMemo, useCallback } from 'react'
import { VolumeSlider } from 'components/VolumeSlider'
import { LoadingOrError } from 'components/LoadingOrError'
import { useConfig } from 'config/storage'
import { useVolumeStore } from 'state/volume'
import { useTheme } from '../theme'

export function SinksScreen() {
  const { config, serverUrl, loading, hasUrl } = useConfig()
  const { colors } = useTheme()
  const { sinks, sinkInputs, setSinkVolume, toggleSinkMuted, setSinkInputVolume, toggleSinkInputMuted, moveSinkInput, wsStatus, reconnect } = useVolumeStore(serverUrl)

  const data = useMemo(() => sinks ?? [], [sinks])

  const moveSinkInputPrompt = useCallback(
    (inputId: number, currentSinkId: number) => {
      const targets = data.filter(s => s.id !== currentSinkId)
      if (!targets.length) return

      const moveToIndex = (index: number) => {
        const target = targets[index]
        if (target) moveSinkInput(target.name, inputId)
      }

      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            title: 'Move sink input',
            options: [...targets.map(t => t.label ?? t.name), 'Cancel'],
            cancelButtonIndex: targets.length,
          },
          buttonIndex => {
            if (buttonIndex < targets.length) moveToIndex(buttonIndex)
          },
        )
        return
      }

      Alert.alert(
        'Move sink input',
        'Choose destination sink',
        [
          ...targets.map((target, index) => ({
            text: target.label ?? target.name,
            onPress: () => moveToIndex(index),
          })),
          { text: 'Cancel', style: 'cancel' },
        ],
      )
    },
    [data, moveSinkInput],
  )

  const renderSinkInput = useCallback(
    (sinkId: number) =>
      (child: { id: number; label: string; volume: number; muted: boolean }) => (
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
          <Pressable style={[styles.moveButton, { backgroundColor: colors.buttonSecondary }]} onPress={() => moveSinkInputPrompt(child.id, sinkId)}>
            <Text style={[styles.moveText, { color: colors.buttonSecondaryText }]}>Move input</Text>
          </Pressable>
        </View>
      ),
    [colors.buttonSecondary, colors.buttonSecondaryText, config.maxVolume, config.minVolume, config.stepVolume, moveSinkInputPrompt, setSinkInputVolume, toggleSinkInputMuted],
  )

  const renderSink = useCallback(
    ({ item }: { item: { id: number; name: string; label: string; volume: number; muted: boolean } }) => {
      const children = sinkInputs?.filter(si => si.sinkId === item.id) ?? []
      return (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
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
            {children.length === 0 ? (
              <Text style={[styles.emptyChild, { color: colors.muted }]}>No inputs attached</Text>
            ) : (
              children.map(renderSinkInput(item.id))
            )}
          </VolumeSlider>
        </View>
      )
    },
    [colors.muted, colors.surface, config.maxVolume, config.minVolume, config.stepVolume, renderSinkInput, setSinkVolume, sinkInputs, toggleSinkMuted],
  )

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
    return <LoadingOrError error='No sinks found.' />
  }

  return (
    <FlatList
      contentContainerStyle={[styles.list, { backgroundColor: colors.background }]}
      data={data}
      keyExtractor={item => String(item.id)}
      renderItem={renderSink}
    />
  )
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 16 },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f8fafc', gap: 12 },
  child: { marginTop: 8, paddingLeft: 16, gap: 8 },
  emptyChild: { marginTop: 4, fontSize: 12, color: '#6b7280' },
  moveButton: { marginTop: 4, paddingVertical: 6 },
  moveText: { color: '#111827', fontWeight: '600' },
})
