export type QuizStateMessage = { type: 'QUIZSTATE'; lastEvent: string; done: boolean } & Omit<
	QuizState,
	'adminCode'
>;

export interface QuizState {
	name: string;
	joinCode: string;
	adminCode: string;
	players: Player[];
	rounds: Round[];
	questions: Question[];
	answers: Answer[];
	currentRound: number;
}

interface Player {
	name: string;
	color?: string;
}

interface Round {
	id: number;
	text: string;
}

interface Question {
	roundId: number;
	id: number;
	text: string;
}

interface Answer {
	roundId: number;
	questionId: number;
	player: string;
	text: string;
	revealed: boolean;
	score?: number;
}
