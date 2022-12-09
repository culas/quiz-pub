export interface QuizRun {
	adminCode: string;
	joinCode: string;
	name: string;
	rounds: RunningRound[];
	quizDate: number;
	currentRound: number;
	players: Player[];
	state: 'preparation' | 'answering' | 'revealing' | 'scoring' | 'finished';
	finishedDate?: number;
}

interface Player {
	name: string;
	color: string;
}

interface RunningRound {
	name: string;
	questions: Question[];
}

interface Question {
	text: string;
	answers: Answer[];
}

interface Answer {
	player: string;
	answer: string;
	score?: number;
}
