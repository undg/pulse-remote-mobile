import { FlatList, View, Text, StyleSheet, PanResponder } from 'react-native'
import { useMemo, useCallback, useRef, useState, useEffect } from 'react'
import { VolumeSlider } from 'components/VolumeSlider'
import { LoadingOrError } from 'components/LoadingOrError'
import { useConfig } from 'config/storage'
import { useVolumeStore } from 'state/volume'
import { useTheme } from '../theme'

export function SinksScreen() {
	const { config, serverUrl, loading, hasUrl } = useConfig()
	const { colors } = useTheme()
	const { sinks, sinkInputs, setSinkVolume, toggleSinkMuted, setSinkInputVolume, toggleSinkInputMuted, moveSinkInput, wsStatus, reconnect } = useVolumeStore(serverUrl)

	const data = useMemo(() => sinks ?? [], [sinks])
	const sinkById = useMemo(() => Object.fromEntries((data ?? []).map(s => [s.id, s])), [data])

	const [draggingId, setDraggingId] = useState<number | null>(null)
	const [dragSourceSinkId, setDragSourceSinkId] = useState<number | null>(null)
	const [hoverSinkId, setHoverSinkId] = useState<number | null>(null)
	const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
	const [containerOffset, setContainerOffset] = useState({ x: 0, y: 0 })
	const [dragLabel, setDragLabel] = useState('')
	const [contentHeight, setContentHeight] = useState(0)
	const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
	const sinkLayouts = useRef<Record<number, { x: number; y: number; width: number; height: number }>>({})
	const sinkRefs = useRef<Record<number, View | null>>({})
	const containerRef = useRef<View | null>(null)
	const listRef = useRef<FlatList<any> | null>(null)
	const scrollOffsetRef = useRef(0)
	const contentHeightRef = useRef(0)
	const containerSizeRef = useRef({ width: 0, height: 0 })

	const updateContainerOffset = useCallback(() => {
		const ref = containerRef.current
		if (ref && 'measureInWindow' in ref) {
			ref.measureInWindow((x, y, width, height) => {
				setContainerOffset(prev => (prev.x === x && prev.y === y ? prev : { x, y }))
				setContainerSize(prev => (prev.width === width && prev.height === height ? prev : { width, height }))
				containerSizeRef.current = { width, height }
			})
		}
	}, [])

	const updateSinkLayout = useCallback((sinkId: number) => {
		const ref = sinkRefs.current[sinkId]
		if (ref && 'measureInWindow' in ref) {
			ref.measureInWindow((x, y, width, height) => {
				sinkLayouts.current = { ...sinkLayouts.current, [sinkId]: { x, y, width, height } }
			})
		}
	}, [])

	useEffect(() => {
		if (draggingId === null) setHoverSinkId(null)
	}, [draggingId])

	const panResponder = useMemo(
		() =>
			PanResponder.create({
				onMoveShouldSetPanResponder: () => draggingId !== null,
				onPanResponderMove: (_, gestureState) => {
					if (draggingId === null) return
					const { moveX, moveY } = gestureState
					setDragPos({ x: moveX, y: moveY })
					const hovered = Object.entries(sinkLayouts.current).find(([, rect]) => {
						const adjustedY = rect.y - scrollOffsetRef.current
						return moveX >= rect.x && moveX <= rect.x + rect.width && moveY >= adjustedY && moveY <= adjustedY + rect.height
					})
					if (hovered) setHoverSinkId(Number(hovered[0]))
					else setHoverSinkId(null)

					const viewportY = moveY - containerOffset.y
					const edgeThreshold = 80
					const scrollStep = 20
					const containerH = containerSizeRef.current.height || containerSize.height || 0
					if (containerH > 0) {
						if (viewportY < edgeThreshold) {
							const nextOffset = Math.max(0, scrollOffsetRef.current - scrollStep)
							listRef.current?.scrollToOffset({ offset: nextOffset, animated: false })
							scrollOffsetRef.current = nextOffset
						} else if (viewportY > containerH - edgeThreshold) {
							const maxOffset = Math.max(0, contentHeightRef.current - containerH)
							const nextOffset = Math.min(maxOffset, scrollOffsetRef.current + scrollStep)
							listRef.current?.scrollToOffset({ offset: nextOffset, animated: false })
							scrollOffsetRef.current = nextOffset
						}
					}
				},
				onPanResponderGrant: () => updateContainerOffset(),
				onPanResponderRelease: () => {
					if (draggingId !== null && hoverSinkId && dragSourceSinkId && hoverSinkId !== dragSourceSinkId) {
						const target = sinkById[hoverSinkId]
						if (target) moveSinkInput(target.name, draggingId)
					}
					setDraggingId(null)
					setHoverSinkId(null)
					setDragSourceSinkId(null)
				},
				onPanResponderTerminationRequest: () => false,
				onPanResponderTerminate: () => {
					setDraggingId(null)
					setHoverSinkId(null)
					setDragSourceSinkId(null)
				},
			}),
		[containerOffset.y, containerSize.height, draggingId, dragSourceSinkId, hoverSinkId, moveSinkInput, sinkById, updateContainerOffset],
	)

	const startDrag = useCallback(
		(child: { id: number; label: string }, sinkId: number) => (event: any) => {
			setDraggingId(child.id)
			setDragSourceSinkId(sinkId)
			setHoverSinkId(sinkId)
			setDragLabel(child.label)
			setDragPos({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })
		},
		[],
	)

	const renderSinkInput = useCallback(
		(sinkId: number) =>
			(child: { id: number; label: string; volume: number; muted: boolean }) => (
				<View style={styles.child} key={child.id}>
					<VolumeSlider
						label={child.label}
						volume={child.volume}
						muted={child.muted}
						min={config.minVolume}
						max={config.maxVolume}
						step={config.stepVolume}
						onToggleMute={() => toggleSinkInputMuted(child.id)}
						onChange={v => setSinkInputVolume(child.id, Math.round(v))}
						onCommit={v => setSinkInputVolume(child.id, Math.round(v))}
						onLongPressHeader={startDrag(child, sinkId)}
					/>
				</View>
			),
		[config.maxVolume, config.minVolume, config.stepVolume, setSinkInputVolume, startDrag, toggleSinkInputMuted],
	)

	const renderSink = useCallback(
		({ item }: { item: { id: number; name: string; label: string; volume: number; muted: boolean } }) => {
			const children = sinkInputs?.filter(si => si.sinkId === item.id) ?? []
			return (
				<View
					style={[styles.card, { backgroundColor: colors.surface, borderColor: hoverSinkId === item.id ? colors.primary : colors.surfaceMuted }]}
					ref={ref => {
						sinkRefs.current[item.id] = ref
					}}
					onLayout={() => updateSinkLayout(item.id)}
				>
					<VolumeSlider
						label={item.label}
						volume={item.volume}
						muted={item.muted}
						min={config.minVolume}
						max={config.maxVolume}
						step={config.stepVolume}
						onToggleMute={() => toggleSinkMuted(item.name)}
						onChange={v => setSinkVolume(item.name, Math.round(v))}
						onCommit={v => setSinkVolume(item.name, Math.round(v))}
					>
						{children.length === 0 ? (
							<Text style={[styles.emptyChild, { color: colors.muted }]}>No inputs attached</Text>
						) : (
							children.map(renderSinkInput(item.id))
						)}
					</VolumeSlider>
				</View>
			)
		},
		[colors.muted, colors.primary, colors.surface, colors.surfaceMuted, config.maxVolume, config.minVolume, config.stepVolume, hoverSinkId, renderSinkInput, setSinkVolume, sinkInputs, toggleSinkMuted, updateSinkLayout],
	)

	if (loading) {
		return <LoadingOrError loading />
	}

	if (!hasUrl || !serverUrl) {
		return <LoadingOrError error='Please set a hostname in Config to connect.' />
	}

	if (wsStatus === 'Closed' || wsStatus === 'Closing') {
		return <LoadingOrError error='Connection lost' onRetry={reconnect} />
	}

	if (!data.length) {
		return <LoadingOrError error='No sinks found.' />
	}

	return (
		<View
			ref={ref => {
				containerRef.current = ref
				updateContainerOffset()
			}}
			style={styles.dragContainer}
			{...panResponder.panHandlers}
		>
			<FlatList
				ref={ref => {
					listRef.current = ref
				}}
				contentContainerStyle={[styles.list, { backgroundColor: colors.background }]}
				data={data}
				keyExtractor={item => String(item.id)}
				renderItem={renderSink}
				onLayout={updateContainerOffset}
				onScroll={event => {
					const offset = event.nativeEvent.contentOffset.y
					scrollOffsetRef.current = offset
				}}
				onContentSizeChange={(w, h) => {
					setContentHeight(h)
					contentHeightRef.current = h
				}}
				scrollEventThrottle={16}
			/>
			{draggingId !== null ? (
				<View
					style={[styles.dragOverlay, { top: dragPos.y - containerOffset.y - 28, left: dragPos.x - containerOffset.x - 140, backgroundColor: colors.surface, borderColor: colors.primary }]}
					pointerEvents='none'
				>
					<Text style={[styles.dragLabel, { color: colors.text }]} numberOfLines={1}>
						{dragLabel}
					</Text>
					<Text style={[styles.dragHint, { color: colors.muted }]}>Drop onto a sink</Text>
				</View>
			) : null}
		</View>
	)
}

const styles = StyleSheet.create({
	list: { padding: 16, gap: 16 },
	card: { padding: 12, borderRadius: 12, backgroundColor: '#f8fafc', gap: 12, borderWidth: 1 },
	child: { marginTop: 8, paddingLeft: 16, gap: 8 },
	emptyChild: { marginTop: 4, fontSize: 12, color: '#6b7280' },
	dragContainer: { flex: 1 },
	dragOverlay: { position: 'absolute', padding: 12, borderWidth: 1, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, elevation: 6 },
	dragLabel: { fontWeight: '700' },
	dragHint: { fontSize: 12, marginTop: 2 },
})
