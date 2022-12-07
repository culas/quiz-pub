<script lang="ts">
	import { goto } from '$app/navigation';
	import { saves } from '$lib/stores/saves.store';

	function createNewQuiz() {
		const newId: string = 'cb87gui';
		$saves = [...$saves, {id: newId, name: '', rounds: []}];
		goto(`${newId}/edit`);
	}
</script>

<h1>QuizPub</h1>

<ul>
	{#each $saves as save}
		<li>
			<a href="{save.id}/edit">Edit {save.name}</a>
		</li>
	{/each}
</ul>
<button on:click={createNewQuiz}>Create new quiz</button>
