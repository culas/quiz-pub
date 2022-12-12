<script lang="ts">
	import { goto } from '$app/navigation';
	import type { QuizState } from '$lib/models/messages';
	import type { QuizSave } from '$lib/models/quiz-save.model';
	import { runCodes } from '$lib/stores/runs.store';
	import { saves } from '$lib/stores/saves.store';
	import { quizMachine } from '$lib/stores/xstate';
	import { getRunAdminCode } from '$lib/utils/get-run-admin-code';
	import { randomId } from '$lib/utils/random-id';
	import { writable } from 'svelte-local-storage-store';

	$: showDeleted = false;

	function runQuiz(save: QuizSave): any {
		const code = getRunAdminCode(save.id);
		if (code) {
			$runCodes = [...$runCodes, code];
			writable(code, {}).set(quizMachine().withContext(createQuizContext(save, code)).initialState);
			goto(`run/${code}`);
		}
	}
	function createQuizContext(save: QuizSave, code: string): QuizState {
		return {
			name: save.name,
			adminCode: code,
			joinCode: randomId(6),
			players: [],
			rounds: save.rounds.map((r, i) => ({ text: r.name, id: i })),
			questions: save.rounds.flatMap((r, ri) =>
				r.questions.map((q, qi) => ({ text: q, id: qi, roundId: ri }))
			),
			answers: [],
			currentRound: 0
		};
	}

	function deleteQuiz(id: string) {
		changeDeletedFlag(id, true);
	}

	function restoreQuiz(id: string) {
		changeDeletedFlag(id, false);
	}

	function createNewQuiz() {
		const newId: string = randomId(5);
		if ($saves.some((save) => save.id === newId)) {
			return;
		}
		$saves = [...$saves, { id: newId, name: '', rounds: [], date: Date.now(), deleted: false }];
		goto(`edit/${newId}`);
	}

	function changeDeletedFlag(id: string, deleted: boolean) {
		$saves = [...$saves.map((save) => (save.id === id ? { ...save, deleted } : save))];
	}
</script>

<h1>Quiz Saves</h1>

<button on:click={createNewQuiz}>create new quiz</button>

{#each $saves.filter((s) => !s.deleted || showDeleted) as save}
	<section>
		<h2>{save.name}</h2>
		<p>Rounds: {save.rounds.length}</p>
		<p>Questions: {save.rounds.reduce((acc, r) => acc + r.questions.length, 0)}</p>
		<p>Last save: {new Date(save.date).toLocaleString()}</p>
		<a class="button" href="edit/{save.id}">Edit</a>
		{#if save.deleted}
			<button on:click={() => restoreQuiz(save.id)}>restore</button>
		{:else}
			<button on:click={() => runQuiz(save)}>run</button>
			<button class="warn" on:click={() => deleteQuiz(save.id)}>delete</button>
		{/if}
	</section>
{/each}

<button on:click={() => (showDeleted = !showDeleted)}
	>{showDeleted ? 'hide' : 'show'} deleted</button
>
