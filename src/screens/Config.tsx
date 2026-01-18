import { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Switch, Pressable, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native'
import { useConfig } from 'config/storage'

export function ConfigScreen() {
  const { config, serverUrl, loading, updateConfig, resetConfig } = useConfig()
  const [hostname, setHostname] = useState(config.hostname)
  const [port, setPort] = useState(config.port)
  const [endpoint, setEndpoint] = useState(config.endpoint)
  const [minVolume, setMinVolume] = useState(String(config.minVolume))
  const [maxVolume, setMaxVolume] = useState(String(config.maxVolume))
  const [stepVolume, setStepVolume] = useState(String(config.stepVolume))
  const [showMonitors, setShowMonitors] = useState(config.showMonitoredSources)
  const [bottomPadding, setBottomPadding] = useState(32)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const scrollRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardVisible(true)
      setBottomPadding(Math.max(32, e.endCoordinates.height - 12))
    })
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
      setBottomPadding(32)
    })
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  const handleSave = () => {
    updateConfig({
      hostname,
      port,
      endpoint,
      minVolume: Number(minVolume),
      maxVolume: Number(maxVolume),
      stepVolume: Number(stepVolume),
      showMonitoredSources: showMonitors,
    })
  }

  const handleReset = () => {
    resetConfig()
    setHostname('192.168.1.244')
    setPort('8448')
    setEndpoint('/api/v1/ws')
    setMinVolume('0')
    setMaxVolume('150')
    setStepVolume('5')
    setShowMonitors(true)
  }

  const focusScroll = (y: number) => {
    scrollRef.current?.scrollTo({ y, animated: true })
  }

  const actionsStyle = keyboardVisible ? [styles.actions, styles.stickyActions] : styles.actions

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading config...</Text>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.container, { paddingBottom: bottomPadding }]}
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='none'
      >
        <Text style={styles.label}>Hostname</Text>
        <TextInput style={styles.input} value={hostname} onFocus={() => focusScroll(0)} onChangeText={text => setHostname(text)} placeholder='192.168.x.x' autoCapitalize='none' />

        <Text style={styles.label}>Port</Text>
        <TextInput style={styles.input} value={port} onFocus={() => focusScroll(80)} onChangeText={text => setPort(text)} keyboardType='numeric' />

        <Text style={styles.label}>Endpoint</Text>
        <TextInput style={styles.input} value={endpoint} onFocus={() => focusScroll(160)} onChangeText={text => setEndpoint(text)} autoCapitalize='none' />

        <Text style={styles.label}>Server URL</Text>
        <Text style={styles.code}>{serverUrl || 'Not set'}</Text>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Min volume</Text>
            <TextInput style={styles.input} value={minVolume} onFocus={() => focusScroll(260)} onChangeText={text => setMinVolume(text)} keyboardType='numeric' />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Max volume</Text>
            <TextInput style={styles.input} value={maxVolume} onFocus={() => focusScroll(260)} onChangeText={text => setMaxVolume(text)} keyboardType='numeric' />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Step</Text>
            <TextInput style={styles.input} value={stepVolume} onFocus={() => focusScroll(260)} onChangeText={text => setStepVolume(text)} keyboardType='numeric' />
          </View>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Show monitored sources</Text>
          <Switch value={showMonitors} onValueChange={value => setShowMonitors(value)} />
        </View>

        <View style={actionsStyle}>
          <Pressable style={[styles.button, styles.save]} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.reset]} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10 },
  label: { fontWeight: '600', marginBottom: 4 },
  code: { padding: 10, backgroundColor: '#f1f5f9', borderRadius: 8, fontFamily: 'monospace' },
  row: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  stickyActions: { paddingBottom: 0 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  save: { backgroundColor: '#16a34a' },
  reset: { backgroundColor: '#ef4444' },
  buttonText: { color: 'white', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
