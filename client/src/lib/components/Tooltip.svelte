<script lang="ts">
	export let tooltipText: string | null;
	export let xAxis: number;
	export let yAxis: number;
</script>

<div class="tooltip" role="tooltip" style="left: {xAxis}px; top: {yAxis}px;">
	{tooltipText}
</div>

<style>
	.tooltip {
		color: white;
		min-width: 80px;
		max-width: 250px;
		position: absolute;
		padding: 0.5rem 0.75rem;
		text-align: center;
		font-weight: 400;
		font-size: 0.75rem;
		line-height: 1.2;
		border-radius: 0.25rem;
		background-color: rgba(0, 0, 0, 0.7);
	}
</style>
