import type { StateEvent } from '$lib/models/events.model';
import type { QuizState } from '$lib/models/messages';
import { connectSocket } from '$lib/utils/websocket';
import { assign, createMachine, interpret } from 'xstate';

const socket = connectSocket(
	new Map([
		['joinCode', 'JLAAHU'],
		['adminCode', 'RYKNG1']
	])
);


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
	} as QuizState,
	schema: {
		events: {} as StateEvent,
	},
	states: {
		lobby: {
			on: {
				START: [
					{ target: 'round.answering', cond: 'quizReady', actions: 'send' },
				]
			}
		},
		round: {
			states: {
				answering: {
					entry: 'sendRound',
					on: {
						ANSWER: [
							{ target: 'answered', actions: ['setAnswers', 'send'] },
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
							{ target: 'revealed', actions: ['revealAnswers', 'send'] },
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
							{ target: 'scored', actions: ['scoreAnswer', 'send'] }
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
		send: (_, event) => socket.set(event),
		sendRound: (ctx) => socket.set({ type: 'start-round', name: ctx.rounds[ctx.currentRound].text, questions: ctx.questions.filter(q => q.roundId === ctx.currentRound).map(q => q.text) }),
		nextRound: assign({ currentRound: ctx => ctx.currentRound + 1 }),
		setAnswers: assign({ answers: (ctx, event) => [...ctx.answers, ...event.answers.map((val, i) => ({ roundId: ctx.currentRound, questionId: i, player: event.player, text: val, revealed: false }))] }),
		revealAnswers: assign({ answers: (ctx, event) => ctx.answers.map(a => ({ ...a, revealed: a.questionId === event.qIdx && a.player === event.player ? true : a.revealed })) }),
		scoreAnswer: assign({
			answers: (ctx, event) => ctx.answers.map(a => ({ ...a, score: a.questionId === event.qIdx && a.roundId === ctx.currentRound && a.player === event.player ? event.score : a.score }))
		}),
	}
});

// pass localstorage value to start method as initial/previous state
export const quizService = interpret(quizMachine).start();
