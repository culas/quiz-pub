<script lang="ts">
	import type { Players } from '$lib/models/messages';

	export let players: Players['players'] = [];
</script>

<div>
	<b>Players:</b>
	{#if players && players.length > 0}
		{#each players as p}
			<span><i style="background-color: {p.color}" />{p.name}</span>
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

	span {
		display: inline-flex;
		align-items: center;
		gap: var(--base);
		padding: 0 calc(var(--base) * 2) 0 var(--base);
		background-color: var(--color-light);
		border-radius: calc(var(--base) * 3);
	}

	i {
		display: inline-block;
		width: calc(var(--base) * 4);
		height: calc(var(--base) * 4);
		border-radius: 50%;
	}
</style>
