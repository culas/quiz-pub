<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let questions: string[];
	const dispatch = createEventDispatcher<{ submit: string[] }>();

	let answers: string[] = [];

	function submit() {
		dispatch('submit', answers);
		answers = [];
	}

	const maxlength = 150;
	const minlength = 1;
	$: disabled =
		answers.length !== questions.length ||
		answers.some((a) => a.length < minlength || a.length > maxlength);
</script>

<form on:submit|preventDefault={submit}>
	{#each questions as q, i}
		<h3>{i + 1}) {q}</h3>
		<input type="text" {minlength} {maxlength} bind:value={answers[i]} />
	{/each}
	<button {disabled} type="submit">send answers</button>
</form>

<style>
	input {
		margin-bottom: 0.5rem;
	}
</style>
