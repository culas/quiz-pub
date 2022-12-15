<script lang="ts">
	import { page } from '$app/stores';
	import { copy } from '$lib/actions/copy.action';
	import { tooltip } from '$lib/actions/tooltip.action';
	import AnswersList from '$lib/components/AnswersList.svelte';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import Standings from '$lib/components/Standings.svelte';
	import { quizMachine } from '$lib/stores/quiz-state-machine';
	import { connectSocket } from '$lib/utils/websocket';
	import type { StateEvent } from '$server-interface/events.model';
	import type { QuizState, SocketMessage } from '$server-interface/messages';
	import { useMachine } from '@xstate/svelte';
	import { writable } from 'svelte-local-storage-store';
	import type { State } from 'xstate';

	const state = writable($page.params.code, {} as State<QuizState, StateEvent, any, any, any>);

	const socket = connectSocket(
		new Map([
			['joinCode', $state.context.joinCode],
			['adminCode', $state.context.adminCode]
		])
	);

	const { state: qService, send } = useMachine(quizMachine(socket), { state: $state });
	$: $state = $qService;

	$: cr = $qService.context.currentRound;

	$: updateStateFromPlayerMessage($socket);

	function updateStateFromPlayerMessage(socket: StateEvent | SocketMessage) {
		if (socket && (socket.type === 'PLAYERS' || socket.type === 'ANSWER')) {
			send(socket);
			$state = $qService; // explicit save, as change detection is off with this flow
		}
	}

	function sendScore(score: { score: number; qIdx: number; player: string }) {
		send({ type: 'SCORE', ...score, rIdx: cr });
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
		<p>
			Invite players with code: <b
				use:copy={location.protocol + location.host + '/play/' + $qService.context.joinCode}
				>{$qService.context.joinCode}</b
			>
			(click code to copy invite link)
		</p>
		<button on:click={() => send('START')}>start</button>
	{:else if $qService.matches('round')}
		<h2>{$qService.context.rounds[cr].text}</h2>
		{#if $qService.matches('round.answering')}
			{#each $qService.context.questions.filter((q) => q.roundId === cr) as q}
				<h3>Q{q.id + 1}: {q.text}</h3>
			{/each}
		{/if}
		{#if $qService.matches('round.scoring') || $qService.matches('round.revealing')}
			<AnswersList
				questions={$qService.context.questions.filter((q) => q.roundId === cr).map((q) => q.text)}
				answers={$qService.context.answers.filter((a) => a.roundId === cr)}
				censorAnswers={$qService.matches('round.revealing')}
				showScoring={$qService.matches('round.scoring')}
				on:score={(e) => sendScore(e.detail)}
			/>
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
			<button on:click={() => send('REVEAL')}>reveal</button>
		{/if}
		{#if $qService.matches('round.scoring')}
			<button
				disabled={$qService.context.answers.some((a) => a.score === undefined)}
				on:click={() => send({ type: 'CONFIRMSCORE' })}>confirm scores</button
			>
		{/if}
	{:else if $qService.matches('result')}
		<h2>Scores</h2>
		<Standings answers={$qService.context.answers} rounds={$qService.context.rounds} />
	{/if}
</div>
