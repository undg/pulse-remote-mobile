module.exports = {
	preset: 'jest-expo',
	testEnvironment: 'jsdom',
	setupFiles: ['./jest.setup.js'],
	setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
	moduleNameMapper: {
		'^components/(.*)$': '<rootDir>/src/components/$1',
		'^screens/(.*)$': '<rootDir>/src/screens/$1',
		'^config/(.*)$': '<rootDir>/src/config/$1',
		'^ws/(.*)$': '<rootDir>/src/ws/$1',
		'^state/(.*)$': '<rootDir>/src/state/$1',
		'^theme$': '<rootDir>/src/theme',
		'^react-native/Libraries/Animated/NativeAnimatedHelper$': '<rootDir>/jest.empty.js',
	},
	transformIgnorePatterns: [
		'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo|@expo(nent)?/.*|@expo-google-fonts/.*|@unimodules|unimodules|sentry-expo|native-base|react-native-svg|react-native-reanimated)',
	],
}
