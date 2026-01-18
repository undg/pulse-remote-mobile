import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native'
import { useTheme } from '../theme'

type Props = {
  loading?: boolean
  error?: string
  onRetry?: () => void
}

export function LoadingOrError({ loading, error, onRetry }: Props) {
  const { colors } = useTheme()

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size='large' color={colors.primary} />
        <Text style={[styles.text, { color: colors.text }]}>Loading...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>{error}</Text>
        {onRetry && (
          <Pressable style={[styles.button, { backgroundColor: colors.buttonPrimary }]} onPress={onRetry}>
            <Text style={[styles.buttonText, { color: colors.buttonPrimaryText }]}>Retry</Text>
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
  button: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  buttonText: { fontWeight: '600' },
})

