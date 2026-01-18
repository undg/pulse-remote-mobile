import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native'

type Props = {
  loading?: boolean
  error?: string
  onRetry?: () => void
}

export function LoadingOrError({ loading, error, onRetry }: Props) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' />
        <Text style={styles.text}>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>{error}</Text>
        {onRetry && (
          <Pressable style={styles.button} onPress={onRetry}>
            <Text style={styles.buttonText}>Retry</Text>
          </Pressable>
        )}
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  text: { fontSize: 16 },
  button: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#111827', borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: '600' },
})
