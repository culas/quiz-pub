export interface QuizSave {
	id: string;
	name: string;
	rounds: Round[];
	date: number;
	deleted: boolean;
}

export interface Round {
	name: string;
	questions: string[];
}
