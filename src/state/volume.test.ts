import { renderHook, act } from '@testing-library/react-native'
import { Action } from 'config/generated/message'
import { useVolumeStore, RELEASE_OPTIMISTIC_TIME } from './volume'
import type { PrapiStatus } from 'config/generated/status'

const mockSend = jest.fn()
const mockReconnect = jest.fn()
const mockClose = jest.fn()
let mockLastJson: any = undefined
const setMockLastJson = (value: any = undefined) => {
	mockLastJson = value
}

jest.mock('ws/client', () => {
	return {
		useWebSocketClient: () => ({ status: 'Open', lastJson: mockLastJson, send: mockSend, reconnect: mockReconnect, close: mockClose }),
	}
})

const baseStatus: PrapiStatus = {
	buildInfo: {
		buildDate: 'now',
		compiler: 'go',
		gitCommit: 'abc',
		gitVersion: '1',
		goVersion: '1.21',
		platform: 'linux',
	},
	sinks: [
		{ id: 1, name: 'sink-1', label: 'Sink 1', volume: 50, muted: false },
		{ id: 2, name: 'sink-2', label: 'Sink 2', volume: 70, muted: false },
	],
	sinkInputs: [{ id: 10, label: 'Input 1', sinkId: 1, volume: 30, muted: false }],
	sources: [{ id: 20, name: 'source-1', label: 'Source 1', volume: 40, muted: false, monitor: '', monitored: false }],
}

function pushStatus(status: PrapiStatus = baseStatus) {
	setMockLastJson({ action: Action.GetStatus, payload: status })
}

describe('useVolumeStore', () => {
	beforeEach(() => {
		jest.useFakeTimers()
		setMockLastJson(undefined)
		mockSend.mockClear()
		mockReconnect.mockClear()
		mockClose.mockClear()
	})

	afterEach(() => {
		jest.useRealTimers()
		setMockLastJson(undefined)
	})

	it('normalizes incoming status payload', () => {
		const { result, rerender } = renderHook(() => useVolumeStore('ws://test'))

    act(() => {
      pushStatus()
      rerender(undefined)
    })


		expect(result.current.sinks[0].volume).toBe(50)
		expect(result.current.sources[0].name).toBe('source-1')
	})

	it('optimistically updates sink volume and unblocks later', () => {
		const { result, rerender } = renderHook(() => useVolumeStore('ws://test', 100))

    act(() => {
      pushStatus()
      rerender(undefined)
    })


		act(() => {
			result.current.setSinkVolume('sink-1', 60)
		})

		expect(result.current.blocked).toBe(true)
		expect(result.current.sinks.find(s => s.name === 'sink-1')?.volume).toBe(60)
		expect(mockSend).toHaveBeenCalledWith({ action: Action.SetSinkVolume, payload: { name: 'sink-1', volume: 60 } })

		act(() => {
			jest.advanceTimersByTime(RELEASE_OPTIMISTIC_TIME)
		})

		expect(result.current.blocked).toBe(false)
	})

	it('moves sink input and sends move action', () => {
		const { result, rerender } = renderHook(() => useVolumeStore('ws://test'))

    act(() => {
      pushStatus()
      rerender(undefined)
    })


		act(() => {
			result.current.moveSinkInput('sink-2', 10)
		})

		const moved = result.current.sinkInputs.find(si => si.id === 10)
		expect(moved?.sinkId).toBe(2)
		expect(mockSend).toHaveBeenCalledWith({ action: Action.MoveSinkInput, payload: { name: 'sink-2', id: 10 } })
	})
})
