<script lang="ts">
	export let tooltipText: string | null;
	export let xAxis: number;
	export let yAxis: number;
</script>

<div id="tooltip" class="absolute card px-2 py-1 text-center text-sm variant-filled opacity-80"
     style="left: {xAxis}px; top: {yAxis}px;">
	{tooltipText}
	<div class="arrow variant-filled"></div>
</div>

<style>
	#tooltip {
		min-width: 80px;
		max-width: 250px;
	}

	.arrow {
		--size: .5rem;
		position: absolute;
		left: calc(50% - calc(var(--size) / 2));
		top: calc(100% - calc(var(--size) / 2));
		height: var(--size);
		width: var(--size);
		transform: rotate(45deg);
		z-index: -1;
	}
</style>
