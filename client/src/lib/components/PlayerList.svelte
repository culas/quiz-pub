<script lang="ts">
	import type { Player } from '$lib/models/quiz-state.model';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import ColorPill from './ColorPill.svelte';

	export let players: Player[] = [];
</script>

<div class="card my-4">
	<Accordion regionControl="text-inherit">
		<AccordionItem open>
			<svelte:fragment slot="summary">Players ({players.length})</svelte:fragment>
			<div class="flex flex-wrap gap-2" slot="content">
				{#each players as p}
					<ColorPill color={p.color}>{p.name}</ColorPill>
				{:else}
					<p class="my-4 italic opacity-50">No players yet…</p>
				{/each}
			</div>
		</AccordionItem>
	</Accordion>
</div>
