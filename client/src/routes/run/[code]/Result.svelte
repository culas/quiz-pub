<script lang="ts">
	import Standings from '$lib/components/Standings.svelte';
	import type { QuizState } from '$lib/models/quiz-state.model';

	export let state: QuizState;
</script>

<h2 class="h2 my-4">Final Scores</h2>
<Standings answers={state.answers} rounds={state.rounds} />
