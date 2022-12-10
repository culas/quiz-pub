<script lang="ts">
	import PlayerList from '../../../lib/components/PlayerList.svelte';

	import { page } from '$app/stores';
	import type { QuizInfo, SocketMessage } from '$lib/models/messages';
	import type { QuizRun } from '$lib/models/quiz-run.model';
	import { connectSocket } from '$lib/utils/websocket';
	import { writable } from 'svelte-local-storage-store';
	const run = writable($page.params.code, {} as QuizRun);

	const socket = connectSocket(
		new Map([
			['joinCode', $run.joinCode],
			['adminCode', $run.adminCode]
		])
	);
	$socket = {
		type: 'quiz-info',
		name: $run.name,
		rounds: $run.rounds.length,
		questions: $run.rounds.reduce((sum, r) => sum + r.questions.length, 0)
	} as QuizInfo;

	$: updateRun($socket);

	function updateRun(msg: SocketMessage) {
		switch (msg.type) {
			case 'players':
				$run = { ...$run, players: msg.players };
				break;
			case 'answers':
				$run = {
					...$run,
					rounds: $run.rounds.map((r, i) =>
						i === $run.currentRound
							? {
									...r,
									questions: r.questions.map((q, qi) => ({
										...q,
										answers: [...q.answers, { player: msg.player, answer: msg.answers[qi] }]
									}))
							  }
							: r
					)
				};
				if (currentRound.questions.every((q) => q.answers.length === $run.players.length)) {
					$run = { ...$run, state: 'revealing' };
				}
				break;
		}
	}

	function nextRound() {
		if ($run.currentRound < $run.rounds.length - 1) {
			$run = {
				...$run,
				state: 'answering',
				currentRound: $run.currentRound + 1
			};
			const round = $run.rounds[$run.currentRound];
			$socket = {
				type: 'start-round',
				name: round.name,
				questions: round.questions.map((q) => q.text)
			};
		} else {
			$run = { ...$run, state: 'finished' };
		}
	}

	function score(question: number, player: string, points: number) {
		$run = {
			...$run,
			rounds: $run.rounds.map((r, i) =>
				i === $run.currentRound
					? {
							...r,
							questions: r.questions.map((q, qi) =>
								qi === question
									? {
											...q,
											answers: q.answers.map((a) =>
												a.player === player ? { ...a, score: points } : a
											)
									  }
									: q
							)
					  }
					: r
			)
		};
		if (currentRound.questions.every((q) => q.answers.every((a) => a.score))) {
			nextRound();
		}
	}

	function reveal(qIdx: number, player: string) {
		console.warn('not yet implemented');
	}

	$: currentRound = $run.rounds[$run.currentRound];
</script>

<h1>Run Quiz «{$run.name}»</h1>

{#if $run.state === 'preparation'}
	<p>Waiting for players to join with code: <b>{$run.joinCode}</b></p>
	<PlayerList players={$run.players} />
	<button on:click={() => nextRound()}>Start first round</button>
{:else if $run.state === 'answering'}
	<h2>Round: {currentRound.name}</h2>
	{#each currentRound?.questions as q, qi}
		<p>{q.text}</p>
		<ul>
			{#each q.answers as a}
				<li>{a.player}</li>
			{/each}
		</ul>
	{/each}
{:else if $run.state === 'revealing'}
	<p>Reveal answers</p>
	<h2>Round: {currentRound.name}</h2>
	{#each currentRound?.questions as q, qi}
		<p>{q.text}</p>
		<ul>
			{#each q.answers as a}
				<li>
					{a.player}: {a.answer} <button on:click={() => reveal(qi, a.player)}>Reveal</button>
				</li>
			{/each}
		</ul>
	{/each}
{:else if $run.state === 'scoring'}
	<h2>Round: {currentRound.name}</h2>
	{#each currentRound?.questions as q, qi}
		<p>{q.text}</p>
		<ul>
			{#each q.answers as a}
				<li>{a.player}: {a.answer} <button on:click={() => score(qi, a.player, 1)}>OK</button></li>
			{/each}
		</ul>
	{/each}
{:else if $run.state === 'finished'}
	<p>Finish the quiz</p>
{/if}
