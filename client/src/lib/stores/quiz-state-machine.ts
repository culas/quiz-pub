import type { StateEvent } from '$server-interface/events.model';
import type { QuizState, SocketMessage } from '$server-interface/messages';
import type { Writable } from 'svelte/store';
import { assign, createMachine } from 'xstate';

export const quizMachine = (socket?: Omit<Writable<StateEvent | SocketMessage>, 'update'>) => createMachine({
	predictableActionArguments: true,
	tsTypes: {} as import("./quiz-state-machine.typegen").Typegen0,
	id: 'quiz',
	initial: 'lobby',
	context: {
		name: '',
		joinCode: '',
		adminCode: '',
		players: [],
		rounds: [],
		questions: [],
		answers: [],
		currentRound: 0,
	} as QuizState,
	schema: {
		events: {} as StateEvent,
	},
	states: {
		lobby: {
			on: {
				PLAYERS: { target: 'lobby', actions: ['setPlayers'] },
				START: [
					{ target: 'round.starting', cond: 'quizReady', actions: ['send'] },
				]
			},
		},
		round: {
			states: {
				starting: {
					always: { target: 'answering', actions: ['sendRound'] },
				},
				answering: {
					on: {
						ANSWER: [
							{ target: 'answered', actions: ['setAnswers'] },
						],
						SKIPANSWERS: {target: 'revealing', actions: 'send'}
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
							{ target: 'scoring', actions: ['reveal', 'sendAnswers'] },
						]
					}
				},
				scoring: {
					on: {
						SCORE: [
							{ target: 'scoring', actions: ['scoreAnswer', 'send'] }
						],
						CONFIRMSCORE: [
							{ target: 'scored' },
						]
					}
				},
				scored: {
					always: [
						{ target: 'finished', cond: 'answersScored', actions: ['nextRound'] },
						{ target: 'scoring' }
					]
				},
				finished: {
					always: [
						{ target: '#result', cond: 'roundsFinished' },
						{ target: 'starting' }
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
		answersScored: (ctx) => ctx.answers.every(a => a.score !== undefined),
		roundsFinished: (ctx) => ctx.currentRound >= ctx.rounds.length,
	},
	actions: {
		send: (_, event) => socket?.set(event),
		sendAnswers: ctx => socket?.set({ type: 'answers', roundName: ctx.rounds[ctx.currentRound].text, answers: ctx.answers.filter(a => a.roundId === ctx.currentRound)}),
		setPlayers: assign({ players: (_, event) => event.players }),
		sendRound: (ctx) => socket?.set({ type: 'start-round', name: ctx.rounds[ctx.currentRound].text, questions: ctx.questions.filter(q => q.roundId === ctx.currentRound).map(q => q.text) }),
		nextRound: assign({ currentRound: ctx => ctx.currentRound + 1 }),
		setAnswers: assign({ answers: (ctx, event) => [...ctx.answers, ...event.answers.map((val, i) => ({ roundId: ctx.currentRound, questionId: i, player: event.player, text: val, revealed: false }))] }),
		reveal: assign({ answers: (ctx) => ctx.answers.map(a => ({ ...a, revealed: true })) }),
		scoreAnswer: assign({
			answers: (ctx, event) => ctx.answers.map(a => ({ ...a, score: a.questionId === event.qIdx && a.roundId === event.rIdx && a.player === event.player ? event.score : a.score }))
		}),
	}
});
