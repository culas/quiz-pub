export interface QuizRun {
	adminCode: string;
	joinCode: string;
	name: string;
	rounds: RunningRound[];
	quizDate: number;
	players: Player[];
	state: 'preparation' | 'answering' | 'revealing' | 'scoring' | 'finished';
	currentRound: number;
	finishedDate?: number;
}

export interface Player {
	name: string;
	color: string;
}

export interface RunningRound {
	name: string;
	questions: Question[];
}

export interface Question {
	text: string;
	answers: Answer[];
}

export interface Answer {
	player: string;
	answer: string;
	revealed: boolean;
	score?: number;
}
