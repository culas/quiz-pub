<script lang="ts">
	import PlayerList from '$lib/components/PlayerList.svelte';
	import type { QuizRun } from '$lib/models/quiz-run.model';
	import { quizMachine } from '$lib/stores/xstate';
	import { connectSocket } from '$lib/utils/websocket';
	import { writable } from 'svelte-local-storage-store';
	import { interpret } from 'xstate';
	$: console.log($qService.value, $qService.matches('round'));
	$: console.table($qService.context.answers);
	const run = writable('RYKNG1', {} as QuizRun);

	const socket = connectSocket(
		new Map([
			['joinCode', 'JLAAHU'],
			['adminCode', 'RYKNG1']
		])
	);

	const qService = interpret(
		quizMachine(socket).withContext({
			name: 'Fishcord Xmas Special',
			players: [
				{ name: 'celep', color: 'red' },
				{ name: 'matte', color: 'green' }
			],
			rounds: [
				{ text: 'Sports', id: 0 },
				{ text: 'Memes', id: 1 }
			],
			questions: [
				{ text: 'Who ate 30 fish fingers in one sitting?', id: 0, roundId: 0 },
				{ text: 'Who won the subathon?', id: 1, roundId: 0 },
				{ text: 'KLIM?', id: 0, roundId: 1 }
			],
			answers: [],
			currentRound: 0
		})
	).start();

	$: cr = $qService.context.currentRound;

	$: if ($socket && ($socket.type === 'PLAYERS' || $socket.type === 'ANSWER')) {
		qService.send($socket);
	}
</script>

<div>
	{#if $qService.matches('lobby')}
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
