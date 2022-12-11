<script lang="ts">
	import { page } from '$app/stores';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import type { StateEvent } from '$lib/models/events.model';
	import type { QuizInfo, SocketMessage, StartRound } from '$lib/models/messages';
	import type { QuizRun } from '$lib/models/quiz-run.model';
	import { connectSocket } from '$lib/utils/websocket';
	import { writable } from 'svelte-local-storage-store';

	const name = writable($page.params.code, '');
	const socket = connectSocket(new Map([['joinCode', $page.params.code]]));
	let state: 'joining' | QuizRun['state'] = 'joining';

	function join() {
		$socket = { type: 'join-quiz', name: $name };
		state = 'preparation';
	}
	if ($name !== '') {
		join();
	}

	let round: Omit<StartRound, 'type'> = {
		name: '',
		questions: []
	};
	let quiz: QuizInfo = {} as QuizInfo;

	$: updateQuiz($socket);

	function updateQuiz(msg: SocketMessage | StateEvent) {
		if (msg === undefined) return;
		switch (msg.type) {
			case 'players':
				quiz.players = msg.players;
				break;
			case 'quiz-info':
				state = 'preparation';
				quiz = msg;
				break;
			case 'start-round':
				state = 'answering';
				round = msg;
				break;
			case 'end-round':
				state = 'revealing';
				break;
			case 'score-answer':
				state = 'scoring';
				break;
		}
	}
</script>

{#if state === 'joining'}
	<form on:submit|preventDefault={join}>
		<label>
			Name
			<input type="text" name="name" bind:value={$name} />
		</label>
		<button type="submit">Join</button>
	</form>
{:else}
	<h1>{quiz?.name}</h1>
{/if}

{#if state === 'preparation'}
	<p>Waiting for players to join and the host to start the quiz</p>
	<PlayerList players={quiz.players} />
{/if}

{#if state === 'answering'}
	<h2>Round: {round.name}</h2>
	{#each round.questions as q}
		<p>{q}</p>
		<input type="text" />
	{/each}
{/if}
