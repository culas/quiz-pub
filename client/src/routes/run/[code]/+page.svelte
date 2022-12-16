<script lang="ts">
	import { page } from '$app/stores';
	import { tooltip } from '$lib/actions/tooltip.action';
	import AnswersList from '$lib/components/AnswersList.svelte';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import type { QuizState, QuizStateMessage } from '$lib/models/quiz-state.model';
	import { quizMachine } from '$lib/stores/quiz-state-machine';
	import { connectSocket } from '$lib/utils/websocket';
	import type { AnswerEvent, PlayersEvent, StateEvent } from '$server-interface/events.model';
	import { useMachine } from '@xstate/svelte';
	import { writable } from 'svelte-local-storage-store';
	import type { State } from 'xstate';
	import Lobby from './Lobby.svelte';
	import Result from './Result.svelte';

	const state = writable($page.params.code, {} as State<QuizState, StateEvent, any, any, any>);

	const socket = connectSocket<QuizStateMessage | PlayersEvent | AnswerEvent>(
		new Map([
			['joinCode', $state.context.joinCode],
			['adminCode', $state.context.adminCode]
		])
	);

	const { state: qService, send } = useMachine(quizMachine(), { state: $state });
	$: $state = $qService;

	function createQuizStateMessage(
		{ adminCode, ...state }: QuizState,
		{ type }: StateEvent,
		done: boolean = false
	): QuizStateMessage {
		return {
			...state,
			done,
			rounds: state.rounds.filter((r) => r.id <= state.currentRound),
			questions: state.questions.filter((q) => q.roundId <= state.currentRound),
			answers: state.answers.map((a) => (a.revealed ? a : { ...a, text: '' })),
			type: 'QUIZSTATE',
			lastEvent: type
		};
	}

	$: cr = $qService.context.currentRound;

	$: updateStateFromPlayerMessage($socket);

	function updateStateFromPlayerMessage(socket: QuizStateMessage | PlayersEvent | AnswerEvent) {
		if (socket && (socket.type === 'PLAYERS' || socket.type === 'ANSWER')) {
			send(socket);
			$state = $qService; // explicit save, as change detection is off with this flow
		}
	}

	$: sendQuizStateToPlayers($state);
	function sendQuizStateToPlayers(state: State<QuizState, StateEvent>) {
		$socket = createQuizStateMessage(state.context, state.event, state.done);
	}

	$: waitingForPlayers = $qService.context.players.filter(
		(p) =>
			!$qService.context.answers
				.filter((a) => a.roundId === cr)
				.map((a) => a.player)
				.includes(p.name)
	);
</script>

<h1>{$qService.context.name}</h1>

<PlayerList players={$qService.context.players} />

<div>
	{#if $qService.matches('lobby')}
		<Lobby state={$qService.context} on:start={() => send('START')} />
	{:else if $qService.matches('round')}
		<h2>Round {cr + 1}: {$qService.context.rounds[cr].text}</h2>
		{#if $qService.matches('round.answering') || $qService.matches('round.revealing')}
			{#each $qService.context.questions.filter((q) => q.roundId === cr) as q}
				<h3>{q.id + 1}) {q.text}</h3>
			{/each}
		{/if}
		{#if $qService.matches('round.answering')}
			<button
				class="warn"
				use:tooltip
				data-tooltip="Will end the round without waiting for all answers!"
				on:click={() => send({ type: 'SKIPANSWERS' })}>skip</button
			>
			<span
				>waiting for <b>{waitingForPlayers.length}</b>
				{waitingForPlayers.length === 1 ? 'player' : 'players'} to submit their answers</span
			>
		{/if}
		{#if $qService.matches('round.revealing')}
			<button on:click={() => send('REVEAL')}>reveal answers</button>
		{/if}
		{#if $qService.matches('round.scoring')}
			<AnswersList
				questions={$qService.context.questions.filter((q) => q.roundId === cr).map((q) => q.text)}
				answers={$qService.context.answers.filter((a) => a.roundId === cr)}
				censorAnswers={$qService.matches('round.revealing')}
				showScoring={$qService.matches('round.scoring')}
				on:score={(e) => send({ type: 'SCORE', ...e.detail, rIdx: cr })}
			/>
			<button
				disabled={$qService.context.answers.some((a) => a.score === undefined)}
				on:click={() => send({ type: 'CONFIRMSCORE' })}>confirm scores</button
			>
		{/if}
	{:else if $qService.matches('result')}
		<Result state={$qService.context} />
	{/if}
</div>
