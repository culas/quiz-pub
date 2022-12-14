<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: number }>();
	export let score: number | undefined = undefined;

	function change(s: number) {
		score = s;
		dispatch('change', s);
	}
</script>

{#each new Array(4).fill(0).map((_, i) => i) as s}
	<button class:active={score === s} on:click={() => change(s)}>{s}</button>
{/each}

<style>
	button {
		flex-shrink: 0;
		border-radius: 50%;
		width: 1.5rem;
		height: 1.5rem;
		padding: 0;
	}

	.active {
		position: relative;
		background-color: var(--color-dark);
	}
</style>
