export type StateEvent = StartEvent | AnswerEvent | RevealEvent | ScoreEvent;

export interface AnswerEvent {
	type: 'ANSWER';
	player: string;
	answers: string[];
}

export interface StartEvent {
	type: 'START';
}

export interface RevealEvent {
	type: 'REVEAL';
	qIdx: number;
	player: string;
}

export interface ScoreEvent {
	type: 'SCORE';
	qIdx: number;
	player: string;
	score: number;
}