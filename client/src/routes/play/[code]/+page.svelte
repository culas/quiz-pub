<script lang="ts">
	import { page } from '$app/stores';
	import AnswersForm from '$lib/components/AnswersForm.svelte';
	import AnswersList from '$lib/components/AnswersList.svelte';
	import NameForm from '$lib/components/NameForm.svelte';
	import PlayerList from '$lib/components/PlayerList.svelte';
	import Standings from '$lib/components/Standings.svelte';
	import type { QuizStateMessage } from '$lib/models/quiz-state.model';
	import { title } from '$lib/stores/title.store';
	import { connectSocket } from '$lib/utils/websocket';
	import type { AnswerEvent, JoinEvent } from '$server-interface/events.model';
	import { persisted } from 'svelte-local-storage-store';

	const name = persisted($page.params.code, '');
	const socket = connectSocket<QuizStateMessage | JoinEvent | AnswerEvent>(
		new Map([['joinCode', $page.params.code]])
	);
	$title = 'Join Quiz';

	function join(newName?: string) {
		if (newName) {
			$name = newName;
			$socket = { type: 'JOIN', name: newName };
		}
	}
	join($name);

	$: updateQuiz($socket);

	let quizState: QuizStateMessage;
	function updateQuiz(msg: QuizStateMessage | JoinEvent | AnswerEvent) {
		if (msg?.type === 'QUIZSTATE' && 'done' in msg) {
			quizState = { ...msg };
			$title = `Play «${quizState.name}»`;
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

<h1>{quizState?.name ?? 'Quiz'}</h1>
<PlayerList players={quizState?.players} />
<div>
	{#if quizState === undefined}
		<p>
			Waiting for Quiz Informations, Quiz with the code <b>{$page.params.code}</b> might not exist.
		</p>
	{:else if quizState.done}
		<h2>Final Scores</h2>
		<Standings rounds={quizState.rounds} answers={quizState.answers} player={$name} />
	{:else if !quizState.players.some((p) => p.name === $name)}
		<NameForm on:submit={(e) => join(e.detail)} />
	{:else if quizState.questions.length === 0}
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
