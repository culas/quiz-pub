<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let questions: string[];
	const dispatch = createEventDispatcher<{ submit: string[] }>();

	let answers: string[] = [];

	function submit() {
		dispatch('submit', answers);
		answers = [];
	}

	$: disabled = answers.length !== questions.length || answers.some((a) => a.length === 0);
</script>

<form on:submit|preventDefault={submit}>
	{#each questions as q, i}
		<p>{q}</p>
		<input type="text" bind:value={answers[i]} />
	{/each}
	<button {disabled} type="submit">send answers</button>
</form>
