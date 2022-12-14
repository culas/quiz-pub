<script lang="ts">
	import type { Players } from '$server-interface/messages';
	import ColorPill from './ColorPill.svelte';

	export let players: Players['players'] = [];
	let collapse = false;
</script>

<div class:collapse>
	<b on:click={() => (collapse = !collapse)}>Players</b>
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
		flex-wrap: wrap;
		overflow: hidden;
	}

	.collapse {
		flex-wrap: nowrap;
	}

	b {
		flex-shrink: 0;
		cursor: pointer;
	}

	b:after {
		content: '\25BC';
		display: inline-block;
		width: 1rem;
		margin-left: var(--base);
	}

	.collapse b:after {
		content: '\25B6';
	}
</style>
