<script lang="ts">
	import { goto } from '$app/navigation';
	import type { QuizSave } from '$lib/models/quiz-save.model';
	import { quizMachine } from '$lib/stores/quiz-state-machine';
	import { runCodes } from '$lib/stores/runs.store';
	import { saves } from '$lib/stores/saves.store';
	import { title } from '$lib/stores/title.store';
	import { createQuizContext } from '$lib/utils/create-quiz-state';
	import { getRunAdminCode } from '$lib/utils/get-run-admin-code';
	import { randomId } from '$lib/utils/random-id';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { persisted } from 'svelte-local-storage-store';

	$: showDeleted = false;
	$title = 'Create';

	function runQuiz(save: QuizSave) {
		const code = getRunAdminCode(save.id);
		if (code) {
			$runCodes = [...$runCodes, code];
			persisted(code, {}).set(
				quizMachine().withContext(createQuizContext(save, code)).initialState
			);
			goto(`run/${code}`);
		}
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

	$: quizzes = $saves.filter((s) => !s.deleted || showDeleted).sort((s) => -s.date);
</script>

<header class="flex flex-wrap items-start">
	<h1 class="flex-1">Quiz Saves</h1>
	<button on:click={createNewQuiz}>create new quiz</button>
</header>

<p>Create and edit your own quizzes.</p>

{#each quizzes as save}
	<section class="card shadow-lg my-4" class:opacity-60={save.deleted}>
		<h2 class="h2 card-header">{save.name}</h2>
		<ul class="p-4 list-disc list-inside">
			<li>Rounds: {save.rounds.length}</li>
			<li>Questions: {save.rounds.reduce((acc, r) => acc + r.questions.length, 0)}</li>
			<li>Last save: {new Date(save.date).toLocaleString()}</li>
		</ul>
		<footer class="card-footer flex flex-wrap gap-2">
			{#if save.deleted}
				<button on:click={() => restoreQuiz(save.id)}>restore</button>
			{:else}
				<a class="button" href="edit/{save.id}">edit</a>
				<button on:click={() => runQuiz(save)}>run</button>
				<span class="flex-1"></span>
				<button class="variant-filled-error" on:click={() => deleteQuiz(save.id)}>delete</button>
			{/if}
		</footer>
	</section>
{/each}

<SlideToggle name="slider-label" active="bg-error-500" bind:checked={showDeleted}>Show deleted quizzes</SlideToggle>
