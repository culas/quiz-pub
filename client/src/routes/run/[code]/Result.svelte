<script lang="ts">
	import Standings from '$lib/components/Standings.svelte';
	import type { QuizState } from '$server-interface/messages';

	export let state: QuizState;
</script>

<h2>Final Scores</h2>
<Standings answers={state.answers} rounds={state.rounds} />
