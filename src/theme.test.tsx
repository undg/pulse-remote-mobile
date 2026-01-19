import type { ReactNode } from 'react'
import { renderHook, act, waitFor } from '@testing-library/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'react-native'
import { ThemeProvider, useTheme, type ThemePreference } from './theme'

const useColorSchemeSpy = jest.spyOn(require('react-native'), 'useColorScheme') as jest.SpyInstance

function renderWithProvider() {
	const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>
	return renderHook(() => useTheme(), { wrapper })
}

describe('ThemeProvider', () => {
	beforeEach(async () => {
		await AsyncStorage.clear()
		useColorSchemeSpy.mockReturnValue('light')
	})

	it('defaults to system with light fallback when scheme unknown', () => {
		useColorSchemeSpy.mockReturnValue(undefined)
		const { result } = renderWithProvider()
		expect(result.current.preference).toBe('system')
		expect(result.current.colors.background).toBe('#f8fafc')
	})

	it('allows setting preference and persists', async () => {
		const { result } = renderWithProvider()

		await act(async () => {
			result.current.setPreference('dark')
		})

		expect(result.current.preference).toBe('dark')
		expect(result.current.colors.background).toBe('#0f172a')
		const stored = await AsyncStorage.getItem('pr-rn-theme')
		expect(stored).toBe('dark')
	})

	it('restores saved preference on mount', async () => {
		await AsyncStorage.setItem('pr-rn-theme', 'light')
		const { result } = renderWithProvider()
		await waitFor(() => expect(result.current.preference).toBe('light'))
		expect(result.current.colors.background).toBe('#f8fafc')
	})

	it('ignores invalid saved preference', async () => {
		await AsyncStorage.setItem('pr-rn-theme', 'invalid' as ThemePreference)
		const { result } = renderWithProvider()
		await waitFor(() => expect(result.current.preference).toBe('system'))
	})

	afterAll(() => {
		useColorSchemeSpy.mockRestore()
	})
})
