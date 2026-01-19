import { render, screen, fireEvent } from '@testing-library/react-native'
import { AboutScreen } from '../About'
import { ThemeProvider } from '../../theme'

const mockUseConfig = jest.fn()
const mockUseVolumeStore = jest.fn()

jest.mock('config/storage', () => ({ useConfig: () => mockUseConfig() }))
jest.mock('state/volume', () => ({ useVolumeStore: () => mockUseVolumeStore() }))

function renderAbout() {
	return render(
		<ThemeProvider>
			<AboutScreen />
		</ThemeProvider>,
	)
}

describe('AboutScreen', () => {
	beforeEach(() => {
		mockUseConfig.mockReset()
		mockUseVolumeStore.mockReset()
	})

	it('shows loading state when config is loading', () => {
		mockUseConfig.mockReturnValue({ loading: true, hasUrl: false, serverUrl: undefined })
		mockUseVolumeStore.mockReturnValue({ buildInfo: undefined, wsStatus: 'Open', reconnect: jest.fn() })

		renderAbout()

		expect(screen.getByText('Loading...')).toBeTruthy()
	})

	it('shows prompt when hostname is missing', () => {
		mockUseConfig.mockReturnValue({ loading: false, hasUrl: false, serverUrl: undefined })
		mockUseVolumeStore.mockReturnValue({ buildInfo: undefined, wsStatus: 'Open', reconnect: jest.fn() })

		renderAbout()

		expect(screen.getByText('Please set a hostname in Config to connect.')).toBeTruthy()
	})

	it('shows reconnect when connection is closed', () => {
		const reconnect = jest.fn()
		mockUseConfig.mockReturnValue({ loading: false, hasUrl: true, serverUrl: 'ws://example' })
		mockUseVolumeStore.mockReturnValue({ buildInfo: undefined, wsStatus: 'Closed', reconnect })

		renderAbout()

		expect(screen.getByText('Connection lost')).toBeTruthy()
		fireEvent.press(screen.getByText('Retry'))
		expect(reconnect).toHaveBeenCalled()
	})

	it('renders build info and placeholders', () => {
		mockUseConfig.mockReturnValue({ loading: false, hasUrl: true, serverUrl: 'ws://example' })
		mockUseVolumeStore.mockReturnValue({
			buildInfo: {
				gitVersion: '1.2.3',
				gitCommit: 'abcdef',
				platform: 'linux',
				buildDate: '2025-01-01',
				goVersion: '',
				compiler: 'gc',
			},
			wsStatus: 'Open',
			reconnect: jest.fn(),
		})

		renderAbout()

		expect(screen.getByText('1.2.3')).toBeTruthy()
		expect(screen.getByText('abcdef')).toBeTruthy()
		expect(screen.getByText('linux')).toBeTruthy()
		expect(screen.getByText('2025-01-01')).toBeTruthy()
		expect(screen.getByText('gc')).toBeTruthy()
		expect(screen.getByText('Not available')).toBeTruthy()
	})
})
