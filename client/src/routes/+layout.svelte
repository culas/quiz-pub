<header><a href="/">QuizPub</a></header>

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

	footer {
		font-size: .75rem;
	}

	a {
		color: var(--color-text);
		text-decoration: none;
		font-weight: bold;
	}
</style>
