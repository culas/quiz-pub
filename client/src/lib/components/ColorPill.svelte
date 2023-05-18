<script lang="ts">
	export let color = 'var(--color-primary-500)';
</script>

<span class="badge variant-filled-surface pl-1">
	<i class="bg-primary-500 w-4 h-4 rounded-full mr-1"
	   style="background-color: rgb({color})">
	</i>
	<slot />
</span>
