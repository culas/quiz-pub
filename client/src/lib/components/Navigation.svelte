<script>
	import { page } from '$app/stores';

	const links = ['play', 'edit', 'run'];
</script>

<nav>
	<ul class="flex gap-2">
		{#each links as link}
			<li>
				<a class="btn hover:variant-soft" href="/{link}"
				   class:variant-filled={$page.url.pathname.includes(link)}>{link}</a>
			</li>
		{/each}
	</ul>
</nav>
