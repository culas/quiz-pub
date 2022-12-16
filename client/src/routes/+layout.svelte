<script>
	import DarkmodeToggle from '$lib/components/DarkmodeToggle.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
</script>

<header>
	<a href="/">QuizPub</a>
	<Navigation />
	<DarkmodeToggle />
</header>

<main>
	<slot />
</main>

<footer>QuizPub prototype to create and run pub quiz style events, by celep for Fishcord</footer>

<style>
	main {
		flex-grow: 1;
		align-self: center;
		width: 50rem;
		max-width: 100%;
		padding: 0 2rem;
	}

	header,
	footer {
		padding: 0.5rem;
		background-color: var(--color-light);
	}

	header {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	footer {
		font-size: 0.75rem;
	}

	a {
		color: var(--color-text);
		text-decoration: none;
		font-size: 1.2rem;
		font-weight: bold;
	}
</style>
