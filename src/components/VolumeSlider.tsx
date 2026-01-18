import Slider from '@react-native-community/slider'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../theme'
import type { GestureResponderEvent } from 'react-native'

type Props = {
  label: string
  volume: number
  muted: boolean
  min: number
  max: number
  step: number
  onChange?: (value: number) => void
  onCommit?: (value: number) => void
  onToggleMute?: (event: GestureResponderEvent) => void
  children?: React.ReactNode
}

export function VolumeSlider(props: Props) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.headerRow}>
        <Pressable onPress={props.onToggleMute} style={[styles.muteButton, { backgroundColor: colors.surfaceMuted }, props.muted && { backgroundColor: colors.error }]}>
          <Text style={[styles.muteText, { color: colors.text }]}>{props.muted ? '🔇' : '🔊'}</Text>
        </Pressable>
        <Text style={[styles.label, { color: colors.text }]}>{props.label}</Text>
        <Text style={[styles.value, { color: colors.text }]}>{props.volume}%</Text>
      </View>
      <Slider
        minimumValue={props.min}
        maximumValue={props.max}
        step={props.step}
        value={props.volume}
        onValueChange={v => props.onChange?.(v)}
        onSlidingComplete={v => props.onCommit?.(Array.isArray(v) ? v[0] : v)}
        minimumTrackTintColor={colors.sliderTrack}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
      />
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 8, padding: 12, borderRadius: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  muteButton: { padding: 8, borderRadius: 8 },
  muteText: { fontSize: 16 },
  label: { flex: 1, fontWeight: '600' },
  value: { width: 50, textAlign: 'right' },
})
