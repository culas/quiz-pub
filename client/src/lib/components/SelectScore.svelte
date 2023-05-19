<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ change: number }>();
	export let score: number | undefined = undefined;

	$: dispatch('change', score);
</script>

<RadioGroup padding="px-2" border="">
	{#each new Array(4).fill(0).map((_, i) => i) as s}
		<RadioItem bind:group={score} name="score" value={s}>{s}</RadioItem>
	{/each}
</RadioGroup>
