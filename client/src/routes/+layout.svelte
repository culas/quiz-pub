<script>
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import Navigation from '$lib/components/Navigation.svelte';
	import { fullTitle } from '$lib/stores/title.store';

	$: document.title = $fullTitle;
</script>

<header>
	<a href="/">QuizPub</a>
	<Navigation />
	<DarkmodeToggle />
</header>

<main>
	<slot />
</main>

<footer>
	QuizPub: create, run and play pub quiz style events • by celep for Fishcord • <a
		href="https://github.com/culas/quiz-pub">GitHub</a
	>
</footer>

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

	header a {
		color: var(--color-text);
		text-decoration: none;
		font-size: 1.2rem;
		font-weight: bold;
	}
</style>
