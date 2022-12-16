import type { QuizSave } from '$lib/models/quiz-save.model';
import type { QuizState } from '$lib/models/quiz-state.model';
import { randomId } from './random-id';

export function createQuizContext(save: QuizSave, code: string): QuizState {
	return {
		name: save.name,
		adminCode: code,
		joinCode: randomId(6),
		players: [],
		rounds: save.rounds.map((r, i) => ({ text: r.name, id: i })),
		questions: save.rounds.flatMap((r, ri) =>
			r.questions.map((q, qi) => ({ text: q, id: qi, roundId: ri }))
		),
		answers: [],
		currentRound: 0
	};
}
