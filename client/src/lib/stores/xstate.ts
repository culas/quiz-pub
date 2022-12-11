import type { Answers } from '$lib/models/messages';
import { assign, createMachine, interpret } from 'xstate';

interface QuizFlatterStructureDraft {
	name: string;
	players: { name: string, color: string }[];
	rounds: { id: number, text: string }[];
	questions: { roundId: number, id: number, text: string }[];
	answers: { roundId: number, questionId: number, text: string, player: string, revealed: boolean, score?: number }[];
	currentRound: number;
}

export const quizMachine = createMachine({
	predictableActionArguments: true,
	tsTypes: {} as import("./xstate.typegen").Typegen0,
	id: 'quiz',
	initial: 'lobby',
	context: {
		name: '',
		players: [],
		rounds: [],
		questions: [],
		answers: [],
		currentRound: 0,
	} as QuizFlatterStructureDraft,
	states: {
		lobby: {
			on: {
				START: [
					{ target: 'round.answering', cond: 'quizReady' },
				]
			}
		},
		round: {
			states: {
				answering: {
					on: {
						ANSWER: [
							{ target: 'answered', actions: 'setAnswers' },
						]
					},
				},
				answered: {
					always: [
						{ target: 'revealing', cond: 'answersComplete' },
						{ target: 'answering' },
					]
				},
				revealing: {
					on: {
						REVEAL: [
							{ target: 'revealed', actions: 'revealAnswers' },
						]
					}
				},
				revealed: {
					always: [
						{ target: 'scoring', cond: 'answersRevealed' },
						{ target: 'revealing' },
					]
				},
				scoring: {
					on: {
						SCORE: [
							{ target: 'scored', actions: 'scoreAnswer' }
						]
					}
				},
				scored: {
					always: [
						{ target: 'finished', cond: 'answersScored', actions: 'nextRound' },
						{ target: 'scoring' }
					]
				},
				finished: {
					always: [
						{ target: '#result', cond: 'roundsFinished' },
						{ target: 'answering' }
					]
				}
			},
		},
		result: {
			id: 'result',
			type: 'final'
		}
	}
}, {
	guards: {
		quizReady: ctx => ctx.players.length > 0,
		answersComplete: (ctx) => ctx.answers.filter(a => a.roundId === ctx.currentRound).length === (ctx.players.length * ctx.questions.filter(q => q.roundId === ctx.currentRound).length),
		answersRevealed: (ctx) => ctx.answers.every(a => a.revealed === true),
		answersScored: (ctx) => ctx.answers.every(a => a.score !== undefined),
		roundsFinished: (ctx) => ctx.currentRound >= ctx.rounds.length,
	},
	actions: {
		nextRound: assign({ currentRound: ctx => ctx.currentRound + 1 }),
		setAnswers: assign({ answers: (ctx, event: Answers) => [...ctx.answers, ...event.answers.map((val, i) => ({ roundId: ctx.currentRound, questionId: i, player: event.player, text: val, revealed: false }))] }),
		revealAnswers: assign({ answers: (ctx, event: Reveal) => ctx.answers.map(a => ({ ...a, revealed: a.questionId === event.qIdx && a.player === event.player ? true : a.revealed })) }),
		scoreAnswer: assign({
			answers: (ctx, event: Score) => ctx.answers.map(a => ({ ...a, score: a.questionId === event.qIdx && a.roundId === ctx.currentRound && a.player === event.player ? event.score : a.score }))
		}),
	}
});

interface Reveal {
	type: 'reveal';
	qIdx: number;
	player: string;
}

interface Score {
	type: 'score';
	qIdx: number;
	player: string;
	score: number;
}

// pass localstorage value to start method as initial/previous state
export const quizService = interpret(quizMachine).start();
