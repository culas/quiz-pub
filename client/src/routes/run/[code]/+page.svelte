<script lang="ts">
	import { page } from '$app/stores';
	import { tooltip } from '$lib/actions/tooltip.action';
	import AnswersList from '$lib/components/AnswersList.svelte';
	import Button from '$lib/components/Button.svelte';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import QuestionsList from '$lib/components/QuestionsList.svelte';
	import Steps from '$lib/components/Steps.svelte';
	import type { QuizState, QuizStateMessage } from '$lib/models/quiz-state.model';
	import { quizMachine } from '$lib/stores/quiz-state-machine';
	import { title } from '$lib/stores/title.store';
	import { connectSocket } from '$lib/utils/websocket';
	import type { AnswerEvent, JoinEvent, LeaveEvent, StateEvent } from '$server-interface/events.model';
	import { useMachine } from '@xstate/svelte';
	import { persisted } from 'svelte-local-storage-store';
	import type { State } from 'xstate';
	import Lobby from './Lobby.svelte';
	import Result from './Result.svelte';

	const state = persisted($page.params.code, {} as State<QuizState, StateEvent, any, any, any>);

	const socket = connectSocket<QuizStateMessage | JoinEvent | LeaveEvent | AnswerEvent>(
		new Map([
			['joinCode', $state.context.joinCode],
			['adminCode', $state.context.adminCode]
		])
	);

	const { state: qService, send } = useMachine(quizMachine(), { state: $state });
	$: $state = $qService;
	$title = `Run «${$qService.context.name}»`;

	function createQuizStateMessage(
		{ adminCode, ...state }: QuizState,
		lobby: boolean,
		done = false
	): QuizStateMessage {
		return {
			...state,
			done,
			rounds: state.rounds.filter((r) => r.id <= state.currentRound),
			questions: state.questions.filter((q) => !lobby && q.roundId <= state.currentRound),
			answers: state.answers.map((a) => (a.revealed ? a : { ...a, text: '' })),
			type: 'QUIZSTATE'
		};
	}

	$: cr = $qService.context.currentRound;

	$: updateStateFromPlayerMessage($socket);

	function updateStateFromPlayerMessage(
		socket: QuizStateMessage | JoinEvent | LeaveEvent | AnswerEvent
	) {
		if (socket && (socket.type === 'JOIN' || socket.type === 'LEAVE' || socket.type === 'ANSWER')) {
			send(socket);
			$state = $qService; // explicit save, as change detection is off with this flow
		}
	}

	$: sendQuizStateToPlayers($state);

	function sendQuizStateToPlayers(state: State<QuizState, StateEvent>) {
		$socket = createQuizStateMessage(state.context, state.matches('lobby'), state.done);
	}

	$: waitingForPlayers = $qService.context.players.filter(
		(p) =>
			!$qService.context.answers
				.filter((a) => a.roundId === cr)
				.map((a) => a.player)
				.includes(p.name)
	);
</script>

<h1 class="h1 mb-4">{$qService.context.name}</h1>

<PlayerList players={$qService.context.players} />

<Steps active={$qService.matches('lobby') ? 0 : cr + 1}
       startIndex={0}
       steps={['Lobby', ...$qService.context.rounds.map(r => r.text)]} />

<div>
	{#if $qService.matches('lobby')}
		<Lobby state={$qService.context} on:start={() => send('START')} />
	{:else if $qService.matches('round')}
		<h2 class="h2 my-4">Round {cr + 1}: {$qService.context.rounds[cr].text}</h2>
		{#if $qService.matches('round.answering') || $qService.matches('round.revealing')}
			<QuestionsList questions={$qService.context.questions.filter((q) => q.roundId === cr)} />
		{/if}
		{#if $qService.matches('round.answering')}
			<button
				class="btn uppercase font-bold variant-filled-error mr-2"
				type="button"
				use:tooltip
				data-tooltip="Will end the round without waiting for all answers!"
				on:click={() => send({ type: 'SKIPANSWERS' })}>skip
			</button>
			<span class="italic opacity-50">
				waiting for <b>{waitingForPlayers.length}</b> {waitingForPlayers.length === 1 ? 'player' : 'players'} to submit their answers
			</span>
		{/if}
		{#if $qService.matches('round.revealing')}
			<Button class="float-right" on:click={() => send('REVEAL')}>reveal answers</Button>
		{/if}
		{#if $qService.matches('round.scoring')}
			<AnswersList
				questions={$qService.context.questions.filter((q) => q.roundId === cr).map((q) => q.text)}
				answers={$qService.context.answers.filter((a) => a.roundId === cr)}
				censorAnswers={$qService.matches('round.revealing')}
				showScoring={$qService.matches('round.scoring')}
				on:score={(e) => send({ type: 'SCORE', ...e.detail, rIdx: cr })}
			/>
			<Button
				class="float-right"
				disabled={$qService.context.answers.some((a) => a.score === undefined)}
				on:click={() => send({ type: 'CONFIRMSCORE' })}>confirm scores
			</Button>
		{/if}
	{:else if $qService.matches('result')}
		<Result state={$qService.context} />
	{/if}
</div>
