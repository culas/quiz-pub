<script lang="ts">
	import { copy } from '$lib/actions/copy.action';
	import { tooltip } from '$lib/actions/tooltip.action';
	import type { QuizState } from '$lib/models/quiz-state.model';
	import { createEventDispatcher } from 'svelte';

	export let state: QuizState;

	const dispatch = createEventDispatcher();
</script>

<p>
	Invite players with the following code (click it to copy invite link):
	<b
		use:tooltip
		data-tooltip="click to copy"
		use:copy={location.origin + '/play/' + state.joinCode}>{state.joinCode}</b
	>
</p>

<p>
	The quiz has <b>{state.rounds.length}</b> rounds and a total of <b>{state.questions.length}</b> questions.
</p>

<button disabled={state.players.length === 0} on:click={() => dispatch('start')}>start quiz</button>
