<script lang="ts">
	import { page } from '$app/stores';
	import { copy } from '$lib/actions/copy.action';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import type { StateEvent } from '$lib/models/events.model';
	import type { QuizState } from '$lib/models/messages';
	import { quizMachine } from '$lib/stores/xstate';
	import { connectSocket } from '$lib/utils/websocket';
	import { writable } from 'svelte-local-storage-store';
	import type { State } from 'xstate';
	import { interpret } from 'xstate';

	const state = writable($page.params.code, {} as State<QuizState, StateEvent>);

	const socket = connectSocket(
		new Map([
			['joinCode', $state.context.joinCode],
			['adminCode', $state.context.adminCode]
		])
	);

	const qService = interpret(quizMachine(socket)).start($state);
	$: cr = $qService.context.currentRound;

	$: if ($socket && ($socket.type === 'PLAYERS' || $socket.type === 'ANSWER')) {
		qService.send($socket);
	}
</script>

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
		<button on:click={() => qService.send('START')}>start</button>
	{:else if $qService.matches('round')}
		<h2>{$qService.context.rounds[cr].text}</h2>
		{#each $qService.context.questions.filter((q) => q.roundId === cr) as q}
			<p><b>Q{q.id + 1}: {q.text}</b></p>
			{#each $qService.context.answers.filter((a) => a.roundId === cr && a.questionId === q.id) as a}
				<div class="answer">
					<span>{a.player}</span>
					<span>{a.score !== undefined ? '(' + a.score + ')' : ''}</span>
					<p>{a.revealed ? a.text : '*****'}</p>
					{#if $qService.matches('round.revealing') && !a.revealed}
						<button on:click={() => qService.send({ type: 'REVEAL', qIdx: q.id, player: a.player })}
							>reveal</button
						>
					{:else if $qService.matches('round.scoring')}
						<button
							on:click={() =>
								qService.send({ type: 'SCORE', qIdx: q.id, player: a.player, score: 1 })}>1</button
						>
						<button
							on:click={() =>
								qService.send({ type: 'SCORE', qIdx: q.id, player: a.player, score: 0 })}>0</button
						>
					{/if}
				</div>
			{/each}
		{/each}
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
