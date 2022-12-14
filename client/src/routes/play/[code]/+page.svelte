<script lang="ts">
	import { page } from '$app/stores';
	import AnswersForm from '$lib/components/AnswersForm.svelte';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import { connectSocket } from '$lib/utils/websocket';
	import type { StateEvent } from '$server-interface/events.model';
	import type { QuizInfo, SocketMessage, StartRound } from '$server-interface/messages';
	import { writable } from 'svelte-local-storage-store';

	const name = writable($page.params.code, '');
	const socket = connectSocket(new Map([['joinCode', $page.params.code]]));
	let state: 'joining' | 'preparation' | 'answering' | 'revealing' | 'scoring' = 'joining';

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
			case 'SKIPANSWERS':
			case 'REVEAL':
				state = 'revealing';
				break;
			case 'score-answer':
			case 'SCORE':
				state = 'scoring';
				break;
		}
	}

	function sendAnswers(answers: string[]) {
		$socket = { type: 'ANSWER', player: $name, answers };
		state = 'revealing';
	}
</script>

{#if state === 'joining'}
	<form on:submit|preventDefault={join}>
		<label>
			Name
			<input type="text" name="name" bind:value={$name} />
		</label>
		<button disabled={$name.length < 2 || $name.length > 12} type="submit">Join</button>
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
	<AnswersForm questions={round.questions} on:submit={(answers) => sendAnswers(answers.detail)} />
{/if}

{#if state === 'revealing'}
	<p>Wait for all players to submit their answers and the host to reveal them</p>
{/if}

{#if state === 'scoring'}
	<p>Wait for host to score all answers</p>
{/if}
