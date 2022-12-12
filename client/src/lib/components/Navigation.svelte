<script>
	import { page } from '$app/stores';
</script>

<nav>
	<ul>
		<li>
			<a href="/edit" class:active={$page.url.pathname.includes('edit')}>create</a>
		</li>
		<li>
			<a href="/run" class:active={$page.url.pathname.includes('run')}>run</a>
		</li>
	</ul>
</nav>

<style>
	nav {
		display: inline-block;
	}

	ul {
		list-style: none;
		margin: 0 1rem;
		padding: 0;
		display: flex;
		gap: 1rem;
	}

	a {
		color: var(--color-primary);
		text-decoration: none;
	}

	a.active,
	a:hover {
		color: var(--color-dark);
	}
</style>
