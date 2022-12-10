<script lang="ts">
	import { goto } from '$app/navigation';
	import type { QuizRun } from '$lib/models/quiz-run.model';
	import type { QuizSave } from '$lib/models/quiz-save.model';
	import { runCodes, runs } from '$lib/stores/runs.store';
	import { saves } from '$lib/stores/saves.store';
	import { createRunQuiz } from '$lib/utils/create-run-quiz';
	import { getRunAdminCode } from '$lib/utils/get-run-admin-code';
	import { randomId } from '$lib/utils/random-id';
	import { writable } from 'svelte-local-storage-store';

	function createNewQuiz() {
		const newId: string = randomId(5);
		if ($saves.some((save) => save.id === newId)) {
			return;
		}
		$saves = [...$saves, { id: newId, name: '', rounds: [], date: Date.now(), deleted: false }];
		goto(`edit/${newId}`);
	}

	function deleteQuiz(id: string) {
		changeDeletedFlag(id, true);
	}

	function restoreQuiz(id: string) {
		changeDeletedFlag(id, false);
	}

	function changeDeletedFlag(id: string, deleted: boolean) {
		$saves = [...$saves.map((save) => (save.id === id ? { ...save, deleted } : save))];
	}

	$: showDeleted = false;
	$: showFinished = false;

	function runQuiz(save: QuizSave): any {
		const code = getRunAdminCode(save.id);
		if (code) {
			$runCodes = [...$runCodes, code];
			writable<QuizRun | undefined>(code, undefined).set(createRunQuiz(save, code));
			goto(`run/${code}`);
		}
	}

	let joinCode = '';
</script>

<form on:submit|preventDefault={() => goto('play/' + joinCode)}>
	<label>
		Join Code
		<input type="text" name="joinCode" bind:value={joinCode} />
	</label>
	<button type="submit" disabled={joinCode.length !== 6}>JOIN</button>
</form>

<h1>Quiz Runs</h1>

{#each $runs.filter((r) => r.state !== 'finished' || showFinished) as quiz}
	<section>
		<h2>{quiz.name}</h2>
		<p>State: {quiz.state}</p>
		<p>Players: {quiz.players.length}</p>
		<p>Join Code: <b>{quiz.joinCode}</b></p>
		<a class="button" href="run/{quiz.adminCode}">Open</a>
	</section>
{/each}
<button on:click={() => (showFinished = !showFinished)}
	>{showFinished ? 'hide' : 'show'} finished</button
>

<h1>Quiz Saves</h1>

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

<button on:click={createNewQuiz}>create new quiz</button>
<button on:click={() => (showDeleted = !showDeleted)}
	>{showDeleted ? 'hide' : 'show'} deleted</button
>
