export interface QuizSave {
	id: string;
	name: string;
	rounds: Round[];
}

export interface Round {
	name: string;
	questions: string[];
}