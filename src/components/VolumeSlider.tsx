import Slider from '@react-native-community/slider'
import { View, Text, Pressable, StyleSheet } from 'react-native'
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
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={props.onToggleMute} style={[styles.muteButton, props.muted && styles.muted]}>
          <Text style={styles.muteText}>{props.muted ? '🔇' : '🔊'}</Text>
        </Pressable>
        <Text style={styles.label}>{props.label}</Text>
        <Text style={styles.value}>{props.volume}%</Text>
      </View>
      <Slider
        minimumValue={props.min}
        maximumValue={props.max}
        step={props.step}
        value={props.volume}
        onValueChange={v => props.onChange?.(v)}
        onSlidingComplete={v => props.onCommit?.(Array.isArray(v) ? v[0] : v)}
        minimumTrackTintColor='#22c55e'
        maximumTrackTintColor='#ccc'
        thumbTintColor='#22c55e'
      />
      {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  muteButton: { padding: 8, borderRadius: 8, backgroundColor: '#f1f5f9' },
  muted: { backgroundColor: '#fecdd3' },
  muteText: { fontSize: 16 },
  label: { flex: 1, fontWeight: '600' },
  value: { width: 50, textAlign: 'right' },
})
