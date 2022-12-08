<script lang="ts">
	import { goto } from '$app/navigation';
	import { saves } from '$lib/stores/saves.store';
	import { randomId } from '$lib/utils/random-id';

	function createNewQuiz() {
		const newId: string = randomId(5);
		if ($saves.some((save) => save.id === newId)) {
			return;
		}
		$saves = [...$saves, { id: newId, name: '', rounds: [], date: Date.now(), deleted: false }];
		goto(`${newId}/edit`);
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
</script>

<h1>QuizPub</h1>

{#each $saves.filter((s) => !s.deleted || showDeleted) as save}
	<section>
		<h2>{save.name}</h2>
		<p>Rounds: {save.rounds.length}</p>
		<p>Questions: {save.rounds.reduce((acc, r) => acc + r.questions.length, 0)}</p>
		<p>Last save: {new Date(save.date).toLocaleString()}</p>
		<a class="button" href="{save.id}/edit">Edit</a>
		{#if save.deleted}
			<button on:click={() => restoreQuiz(save.id)}>Restore</button>
		{:else}
			<button on:click={() => deleteQuiz(save.id)}>Delete</button>
		{/if}
	</section>
{/each}

<button on:click={createNewQuiz}>Create new quiz</button>
<button on:click={() => (showDeleted = !showDeleted)}>{showDeleted ? 'hide' : 'show'} deleted</button>
