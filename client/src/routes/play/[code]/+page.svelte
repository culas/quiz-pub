<script lang="ts">
	import { page } from '$app/stores';
	import AnswersForm from '$lib/components/AnswersForm.svelte';
	import AnswersList from '$lib/components/AnswersList.svelte';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import Standings from '$lib/components/Standings.svelte';
	import { connectSocket } from '$lib/utils/websocket';
	import type { StateEvent } from '$server-interface/events.model';
	import type { QuizStateMessage, SocketMessage } from '$server-interface/messages';
	import { writable } from 'svelte-local-storage-store';
	import NameForm from './NameForm.svelte';

	const name = writable($page.params.code, '');
	const socket = connectSocket(new Map([['joinCode', $page.params.code]]));

	function join(newName?: string) {
		if (newName) {
			$name = newName;
			$socket = { type: 'join-quiz', name: newName };
		}
	}
	join($name);

	$: updateQuiz($socket);

	let quizState: QuizStateMessage & { lastEvent: string; done: boolean };
	function updateQuiz(
		msg: SocketMessage | StateEvent | (QuizStateMessage & { lastEvent: string; done: boolean })
	) {
		if (msg?.type === 'quiz-state' && 'done' in msg) {
			quizState = { ...msg };
		}
	}

	function sendAnswers(answers: string[]) {
		$socket = { type: 'ANSWER', player: $name, answers };
	}
	$: submitted = quizState?.answers.some(
		(a) => a.roundId === quizState.currentRound && a.player === $name
	);
	$: currentQ = quizState?.questions
		.filter((q) => q.roundId === quizState.currentRound)
		.map((q) => q.text);
</script>

<h1>{quizState?.name}</h1>
<PlayerList players={quizState?.players} />
<div>
	{#if quizState === undefined}
		<p>
			Waiting for Quiz Informations, Quiz with the code <b>{$page.params.code}</b> might not exist.
		</p>
	{:else if quizState.done}
		<h2>Final Scores</h2>
		<Standings rounds={quizState.rounds} answers={quizState.answers} />
	{:else if !quizState.players.some((p) => p.name === $name)}
		<NameForm on:submit={(e) => join(e.detail)} />
	{:else if quizState.lastEvent === 'PLAYERS'}
		<p>
			The quiz has <b>{quizState.rounds.length}</b> rounds and a total of
			<b>{quizState.questions.length}</b> questions.
		</p>
		<p>Waiting for players to join and the host to start the quiz.</p>
	{:else}
		<h2>Round {quizState.currentRound + 1}: {quizState.rounds.at(quizState.currentRound)?.text}</h2>
		{#if submitted}
			<AnswersList
				questions={currentQ}
				answers={quizState.answers.filter(
					(a) => a.roundId === quizState.currentRound && a.revealed
				)}
				showScores={true}
			/>
			<p>Waiting for other players to submit their answers and the host to score them.</p>
		{:else}
			<AnswersForm questions={currentQ} on:submit={(answers) => sendAnswers(answers.detail)} />
		{/if}
	{/if}
</div>
