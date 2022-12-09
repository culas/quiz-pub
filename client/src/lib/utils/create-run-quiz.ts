import type { QuizRun } from '$lib/models/quiz-run.model';
import type { QuizSave } from '$lib/models/quiz-save.model';
import { randomId } from './random-id';

export function createRunQuiz(save: QuizSave, adminCode: string): QuizRun {
	return {
		adminCode,
		joinCode: randomId(6),
		name: save.name,
		rounds: save.rounds.map(round => ({ name: round.name, questions: round.questions.map(q => ({ text: q, answers: [] })) })),
		quizDate: save.date,
		currentRound: 0,
		players: [],
		state: 'preparation'
	}
}
