<script lang="ts">
	import { page } from '$app/stores';
	import { copy } from '$lib/actions/copy.action';
	import PlayerList from '$lib/components/PlayerList.svelte';
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

	$: playersAnswered = $qService.context.answers
		.filter((a) => a.roundId === cr)
		.map((name) => $qService.context.players.find((p) => p.name === name.player))
		.reduce(
			(acc, player) => (player && !acc.includes(player) ? acc.concat(player) : acc),
			[] as { name: string; color: string }[]
		);
</script>

<h1>{$qService.context.name}</h1>

<div>
	{#if $qService.matches('lobby')}
		<p>
			Invite players with code: <b
				use:copy={location.protocol + location.host + '/play/' + $qService.context.joinCode}
				>{$qService.context.joinCode}</b
			>
			(click code to copy invite link)
		</p>
		<PlayerList players={$qService.context.players} />
		<button on:click={() => send('START')}>start</button>
	{:else if $qService.matches('round')}
		<h2>{$qService.context.rounds[cr].text}</h2>
		{#if $qService.matches('round.answering')}
			<PlayerList players={playersAnswered} />
		{/if}
		{#if $qService.matches('round.revealing')}
			<button on:click={() => send('REVEAL')}>reveal</button>
		{/if}
		{#each $qService.context.questions.filter((q) => q.roundId === cr) as q}
			<p><b>Q{q.id + 1}: {q.text}</b></p>
			{#if $qService.matches('round.scoring')}
				{#each $qService.context.answers.filter((a) => a.roundId === cr && a.questionId === q.id) as a}
					<div class="answer">
						<span>{a.player}</span>
						<span>{a.score !== undefined ? '(' + a.score + ')' : ''}</span>
						<p>{a.text}</p>
						{#if $qService.matches('round.scoring')}
								<button
								on:click={() => send({ type: 'SCORE', qIdx: q.id, player: a.player, score: 1 })}
								>1</button
								>
							<button
								on:click={() => send({ type: 'SCORE', qIdx: q.id, player: a.player, score: 0 })}
								>0</button
							>
						{/if}
					</div>
				{/each}
			{/if}
		{/each}
		{#if $qService.matches('round.scoring')}
			<button
				disabled={$qService.context.answers.some((a) => a.score === undefined)}
				on:click={() => send({ type: 'CONFIRMSCORE' })}>confirm scores</button
			>
		{/if}
	{:else if $qService.matches('result')}
		<h2>Scores</h2>
		{#each $qService.context.players as player}
			<p>
				<b>{player.name}:</b>
				{$qService.context.answers
					.filter((a) => a.player === player.name)
					.reduce((sum, a) => sum + (a.score ?? 0), 0)}
			</p>
		{/each}
	{/if}
</div>

<style>
	.answer {
		display: flex;
		gap: 0.5rem;
	}

	.answer p {
		flex-grow: 1;
	}

	.answer button {
		padding: 0 0.25rem;
	}
</style>
