export type SocketMessage = HostMessage | PlayerMessage | ServerMessage | QuizStateMessage;

export type QuizStateMessage = { type: 'quiz-state' } & QuizState;

export interface QuizState {
	name: string;
	joinCode: string;
	adminCode: string;
	players: { name: string, color: string }[];
	rounds: { id: number, text: string }[];
	questions: { roundId: number, id: number, text: string }[];
	answers: { roundId: number, questionId: number, text: string, player: string, revealed: boolean, score?: number }[];
	currentRound: number;
}

// from host to server
export type HostMessage = QuizInfo | StartRound | EndRound | ScoreAnswer;

export interface StartRun {
	type: 'start-run';
	joinCode: string;
	adminCode: string;
	name: string;
}

// from server to player
export interface QuizInfo {
	type: 'quiz-info';
	name: string;
	rounds: number;
	questions: number;
	players: { name: string, color: string }[];
}

// from server
export type ServerMessage = Players;

export interface Players {
	type: 'players';
	players: { name: string, color: string }[];
}

// from host to players (via server ofc)
export interface StartRound {
	type: 'start-round';
	name: string;
	questions: string[];
}

export interface EndRound {
	type: 'end-round';
}

export interface ScoreAnswer {
	type: 'score-answer';
	player: string;
	questionIndex: number;
	points: number;
}

// from player to host (via server ofc)
export type PlayerMessage = JoinQuiz | Answers;

export interface JoinQuiz {
	type: "join-quiz";
	name: string;
}

export interface Answers {
	type: 'answers';
	player: string;
	answers: string[];
}