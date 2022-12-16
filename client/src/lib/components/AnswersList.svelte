<script lang="ts">
	import type { Answer } from '$server-interface/messages';
	import { createEventDispatcher } from 'svelte';
	import SelectScore from './SelectScore.svelte';

	export let questions: string[] = [];
	export let answers: Answer[] = [];
	export let showScoring = false;
	export let showScores = false;
	export let censorAnswers = false;

	const dispatch = createEventDispatcher();

	function score(score: number, qIdx: number, player: string) {
		dispatch('score', { score, qIdx, player });
	}
</script>

{#each questions as q, i}
	<h3>{i + 1}) {q}</h3>
	{#each answers.filter((a) => a.questionId === i) as a}
		<div>
			<b>{a.player}:</b>
			<p>{censorAnswers ? '•••••' : a.text}</p>
			{#if showScoring}
				<SelectScore score={a.score} on:change={(e) => score(e.detail, i, a.player)} />
			{/if}
			{#if showScores}
				<span>{a.score ?? '–'}</span>
			{/if}
		</div>
	{/each}
{/each}

<style>
	div {
		display: flex;
		gap: 0.5rem;
		margin: 0.25rem 0;
		padding: 0.25rem;
		min-height: 2rem;
	}

	div:hover {
		background-color: var(--color-light);
	}

	div p {
		flex-grow: 1;
		margin: 0;
	}
</style>
