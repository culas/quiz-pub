<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { createEventDispatcher } from 'svelte';

	export let questions: string[] = [];
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

<form on:submit|preventDefault={submit}
      class="card shadow-lg my-4">
	<div class="pt-4 px-4">
		{#each questions as q, i}
			<label class="flex flex-wrap items-end mb-4 label">
				<span class="w-full">{q}</span>
				<div class="input-group input-group-divider grid-cols-[auto_1fr]">
					<div class="input-group-shim">{i + 1}</div>
					<input
						type="text"
						{minlength}
						{maxlength}
						bind:value={answers[i]} />
				</div>
			</label>
		{/each}
	</div>
	<footer class="card-footer flex justify-end">
		<Button {disabled} type="submit">send answers</Button>
	</footer>
</form>
