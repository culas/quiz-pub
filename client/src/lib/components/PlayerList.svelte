<script lang="ts">
	import type { Players } from '$lib/models/messages';
	import ColorPill from './ColorPill.svelte';

	export let players: Players['players'] = [];
</script>

<div>
	<b>Players:</b>
	{#if players && players.length > 0}
		{#each players as p}
			<ColorPill color={p.color}>{p.name}</ColorPill>
		{/each}
	{:else}
		none
	{/if}
</div>

<style>
	div {
		--base: 0.25rem;
		display: flex;
		gap: var(--base);
		margin: var(--base) 0;
		line-height: calc(var(--base) * 6);
	}
</style>
