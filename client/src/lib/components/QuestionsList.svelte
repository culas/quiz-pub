<script lang="ts">
	import type { Question } from '$lib/models/quiz-state.model';

	export let questions: Question[] = [];
</script>

<ol class="list card p-4 shadow-lg my-4">
	{#each questions as q}
		<li>
			<span class="badge-icon p-4 variant-soft">{q.id + 1}</span>
			<span>{q.text}</span>
		</li>
	{/each}
</ol>
