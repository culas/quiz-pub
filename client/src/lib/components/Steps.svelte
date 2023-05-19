<script lang="ts">
	import { fade } from 'svelte/transition';

	export let active = 0;
	export let steps: string[] = [];
	export let startIndex = 1;
	$: isActive = (stepIdx: number) => stepIdx === active;
</script>

<section class="my-2 py-2 space-y-4">
	<header class="flex items-center border-t mt-[15px] border-surface-400-500-token gap-4"
	        transition:fade|local={{ duration: 100 }}>
		{#each steps as step, idx}
			<div class="-mt-[15px] transition-all duration-300" class:flex-1={isActive(idx)}>
				<span class="badge {isActive(idx) ? 'variant-filled' : 'variant-filled-surface'}">
					{isActive(idx) ? `${step}` : idx + startIndex}
				</span>
			</div>
		{/each}
	</header>
</section>
