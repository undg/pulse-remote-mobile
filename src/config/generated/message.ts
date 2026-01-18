import type { PrapiStatus } from 'config/generated/status'

export enum Action {
	GetBuildInfo = 'GetBuildInfo',
	GetStatus = 'GetStatus',
	MoveSinkInput = 'MoveSinkInput',
	MoveSourceOutput = 'MoveSourceOutput',
	SetSinkInputMuted = 'SetSinkInputMuted',
	SetSinkInputVolume = 'SetSinkInputVolume',
	SetSinkMuted = 'SetSinkMuted',
	SetSinkVolume = 'SetSinkVolume',
	SetSourceInputMuted = 'SetSourceInputMuted',
	SetSourceInputVolume = 'SetSourceInputVolume',
	SetSourceMuted = 'SetSourceMuted',
	SetSourceVolume = 'SetSourceVolume',
}

export type MessageGetStatus = { action: Action.GetStatus }
export type MessageGetBuildInfo = { action: Action.GetBuildInfo }
export type MessageSetSinkVolume = { action: Action.SetSinkVolume, payload: { name: string, volume: number } }
export type MessageSetSinkMuted = { action: Action.SetSinkMuted, payload: { name: string, muted: boolean } }
export type MessageSetSinkInputVolume = { action: Action.SetSinkInputVolume, payload: { id: number, volume: number } }
export type MessageSetSinkInputMuted = { action: Action.SetSinkInputMuted, payload: { id: number, muted: boolean } }
export type MessageMoveSinkInput = { action: Action.MoveSinkInput, payload: { name: string, id: number } }
export type MessageSetSourceVolume = { action: Action.SetSourceVolume, payload: { name: string, volume: number } }
export type MessageSetSourceMuted = { action: Action.SetSourceMuted, payload: { name: string, muted: boolean } }

export type OutgoingMessage =
	| MessageGetStatus
	| MessageGetBuildInfo
	| MessageSetSinkVolume
	| MessageSetSinkMuted
	| MessageSetSinkInputVolume
	| MessageSetSinkInputMuted
	| MessageMoveSinkInput
	| MessageSetSourceVolume
	| MessageSetSourceMuted
	| { action: Action.MoveSourceOutput | Action.SetSourceInputMuted | Action.SetSourceInputVolume, payload?: unknown }

export type IncomingStatusMessage = {
	action: Action.GetStatus
	status: number
	payload?: PrapiStatus
	error?: string
}

export type IncomingMessage = IncomingStatusMessage
