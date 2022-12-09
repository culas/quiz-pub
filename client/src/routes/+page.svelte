<script lang="ts">
	import { goto } from '$app/navigation';
	import type { QuizSave } from '$lib/models/quiz-save.model';
	import { saves } from '$lib/stores/saves.store';
	import { getRunAdminCode } from '$lib/utils/get-run-admin-code';
	import { randomId } from '$lib/utils/random-id';

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

	function runQuiz(save: QuizSave): any {
		const code = getRunAdminCode(save.id);
		if (code) {
			goto(`run/${code}`);
		}
	}
</script>

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
<button on:click={() => (showDeleted = !showDeleted)}>{showDeleted ? 'hide' : 'show'} deleted</button>
