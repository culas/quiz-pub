import type { QuizState } from '$lib/models/quiz-state.model';
import type { StateEvent } from '$server-interface/events.model';
import { assign, createMachine } from 'xstate';

export const quizMachine = () =>
	createMachine(
		{
			predictableActionArguments: true,
			tsTypes: {} as import('./quiz-state-machine.typegen').Typegen0,
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
				currentRound: 0
			} as QuizState,
			schema: {
				events: {} as StateEvent
			},
			states: {
				lobby: {
					on: {
						JOIN: { target: 'lobby', actions: 'addPlayer' },
						LEAVE: { target: 'lobby', actions: 'removePlayer' },
						START: [{ target: 'round.starting', cond: 'quizReady' }]
					}
				},
				round: {
					states: {
						starting: {
							always: { target: 'answering', actions: ['resetPlayerColors'] }
						},
						answering: {
							on: {
								ANSWER: [{ target: 'answered', actions: ['setAnswers'] }],
								SKIPANSWERS: { target: 'revealing' }
							}
						},
						answered: {
							always: [{ target: 'revealing', cond: 'answersComplete' }, { target: 'answering' }]
						},
						revealing: {
							on: {
								REVEAL: [{ target: 'scoring', actions: ['reveal'] }]
							}
						},
						scoring: {
							on: {
								SCORE: [{ target: 'scoring', actions: ['scoreAnswer'] }],
								CONFIRMSCORE: [{ target: 'scored' }]
							}
						},
						scored: {
							always: [
								{ target: 'finished', cond: 'answersScored', actions: ['nextRound'] },
								{ target: 'scoring' }
							]
						},
						finished: {
							always: [{ target: '#result', cond: 'roundsFinished' }, { target: 'starting' }]
						}
					}
				},
				result: {
					id: 'result',
					type: 'final'
				}
			}
		},
		{
			guards: {
				quizReady: (ctx) => ctx.players.length > 0,
				answersComplete: (ctx) =>
					ctx.answers.filter((a) => a.roundId === ctx.currentRound).length ===
					ctx.players.length * ctx.questions.filter((q) => q.roundId === ctx.currentRound).length,
				answersScored: (ctx) => ctx.answers.every((a) => a.score !== undefined),
				roundsFinished: (ctx) => ctx.currentRound >= ctx.rounds.length
			},
			actions: {
				addPlayer: assign({
					players: (ctx, { name }) =>
						ctx.players.some((p) => p.name === name)
							? ctx.players
							: [...ctx.players, { name: name }]
				}),
				removePlayer: assign({
					players: (ctx, { name }) => ctx.players.filter((p) => p.name === name)
				}),
				nextRound: assign({ currentRound: (ctx) => ctx.currentRound + 1 }),
				setAnswers: assign({
					answers: (ctx, event) => [
						...ctx.answers,
						...event.answers.map((val, i) => ({
							roundId: ctx.currentRound,
							questionId: i,
							player: event.player,
							text: val,
							revealed: false
						}))
					],
					players: (ctx, event) =>
						ctx.players.map((p) =>
							p.name === event.player ? { ...p, color: 'var(--color-primary)' } : p
						)
				}),
				reveal: assign({ answers: (ctx) => ctx.answers.map((a) => ({ ...a, revealed: true })) }),
				resetPlayerColors: assign({
					players: (ctx) => ctx.players.map((p) => ({ ...p, color: 'var(--color-white)' }))
				}),
				scoreAnswer: assign({
					answers: (ctx, event) =>
						ctx.answers.map((a) => ({
							...a,
							score:
								a.questionId === event.qIdx && a.roundId === event.rIdx && a.player === event.player
									? event.score
									: a.score
						}))
				})
			}
		}
	);
