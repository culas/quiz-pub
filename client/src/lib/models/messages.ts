export type SocketMessage = HostMessage | PlayerMessage | ServerMessage;
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