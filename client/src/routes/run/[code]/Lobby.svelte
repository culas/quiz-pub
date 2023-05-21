<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip.action';
	import Button from '$lib/components/Button.svelte';
	import type { QuizState } from '$lib/models/quiz-state.model';
	import { clipboard } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	export let state: QuizState;

	const dispatch = createEventDispatcher();
</script>

<p>
	Invite players with the following code:
	<button use:tooltip
	        data-tooltip="click to copy invite URL"
	        use:clipboard={`${location.origin}/play/${state.joinCode}`}
	        class="btn btn-sm font-bold variant-soft">
		{state.joinCode}
	</button>
</p>

<p>
	This quiz has <b>{state.rounds.length}</b> rounds and a total of <b>{state.questions.length}</b> questions.
</p>

<Button class="mt-4 float-right"
        disabled={state.players.length === 0}
        on:click={() => dispatch('start')}>
	start quiz
</Button>
