<script lang="ts">
	import type { Answer } from '$lib/models/quiz-state.model';
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
	<section class="card shadow-lg my-4 pb-3">
		<h3 class="h3 flex items-center gap-4 card-header mb-2">
			<span class="badge-icon p-4 variant-soft">{i + 1}</span>
			{q}
		</h3>
		{#each answers.filter((a) => a.questionId === i) as a}
			<div class="flex items-start p-1 mx-3 hover:variant-soft rounded-lg">
				<b class="mt-1">{a.player}:</b>
				<p class="flex-1 px-2 mt-1">{censorAnswers ? '•••••' : a.text}</p>
				{#if showScoring}
					<SelectScore score={a.score} on:change={(e) => score(e.detail, i, a.player)} />
				{/if}
				{#if showScores}
					<span class="rounded-token variant-soft px-2 my-1">{a.score ?? '–'}</span>
				{/if}
			</div>
		{/each}
	</section>
{/each}
