<script lang="ts">
	export let color: string = 'var(--color-primary)';
</script>

<span><i style="background-color: {color}" /><slot /></span>

<style>
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
