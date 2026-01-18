import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import type { Theme as NavigationTheme } from '@react-navigation/native'

export type ThemePreference = 'system' | 'light' | 'dark'

export type ThemeColors = {
	primary: string
	background: string
	surface: string
	surfaceMuted: string
	text: string
	muted: string
	border: string
	card: string
	buttonPrimary: string
	buttonPrimaryText: string
	buttonSecondary: string
	buttonSecondaryText: string
	inputBackground: string
	inputBorder: string
	error: string
	success: string
	sliderTrack: string
}

type ThemeState = {
	preference: ThemePreference
	setPreference: (next: ThemePreference) => void
	colors: ThemeColors
	isDark: boolean
	navigationTheme: NavigationTheme
}

type ThemeDefinition = {
	name: 'light' | 'dark'
	colors: ThemeColors
}

type ThemeProviderProps = {
	children: ReactNode
}

const STORAGE_KEY = 'pr-rn-theme'

const lightTheme: ThemeDefinition = {
	name: 'light',
	colors: {
		primary: '#22c55e',
		background: '#f8fafc',
		surface: '#ffffff',
		surfaceMuted: '#f1f5f9',
		text: '#0f172a',
		muted: '#6b7280',
		border: '#e5e7eb',
		card: '#e2e8f0',
		buttonPrimary: '#111827',
		buttonPrimaryText: '#ffffff',
		buttonSecondary: '#e5e7eb',
		buttonSecondaryText: '#0f172a',
		inputBackground: '#ffffff',
		inputBorder: '#d1d5db',
		error: '#ef4444',
		success: '#22c55e',
		sliderTrack: '#22c55e',
	},
}

const darkTheme: ThemeDefinition = {
	name: 'dark',
	colors: {
		primary: '#22c55e',
		background: '#0f172a',
		surface: '#111827',
		surfaceMuted: '#1f2937',
		text: '#e5e7eb',
		muted: '#9ca3af',
		border: '#1f2937',
		card: '#1f2937',
		buttonPrimary: '#22c55e',
		buttonPrimaryText: '#0b131f',
		buttonSecondary: '#1f2937',
		buttonSecondaryText: '#e5e7eb',
		inputBackground: '#0b111a',
		inputBorder: '#1f2937',
		error: '#f87171',
		success: '#22c55e',
		sliderTrack: '#22c55e',
	},
}

const ThemeContext = createContext<ThemeState | null>(null)

export function ThemeProvider({ children }: ThemeProviderProps) {
	const systemScheme = useColorScheme()
	const [preference, setPreferenceState] = useState<ThemePreference>('system')

	useEffect(() => {
		AsyncStorage.getItem(STORAGE_KEY)
			.then(value => {
				if (value === 'light' || value === 'dark' || value === 'system') {
					setPreferenceState(value)
				}
			})
			.catch(() => {})
	}, [])

	const resolved = preference === 'system' ? systemScheme ?? 'light' : preference
	const active = resolved === 'dark' ? darkTheme : lightTheme

	const navigationTheme = useMemo<NavigationTheme>(() => {
		const base = active.name === 'dark' ? DarkTheme : DefaultTheme
		return {
			...base,
			colors: {
				...base.colors,
				primary: active.colors.primary,
				background: active.colors.background,
				card: active.colors.surface,
				text: active.colors.text,
				border: active.colors.border,
				notification: active.colors.primary,
			},
		}
	}, [active])

	const setPreference = (next: ThemePreference) => {
		setPreferenceState(next)
		AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {})
	}

	const value = useMemo<ThemeState>(
		() => ({ preference, setPreference, colors: active.colors, isDark: active.name === 'dark', navigationTheme }),
		[preference, active, navigationTheme],
	)

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}
