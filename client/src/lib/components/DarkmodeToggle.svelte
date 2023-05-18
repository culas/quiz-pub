<script lang="ts">
	import { persisted } from 'svelte-local-storage-store';

	const STORAGE_KEY = 'darkmode';
	const DARK_PREFERENCE = '(prefers-color-scheme: dark)';

	const prefersDarkThemes = () => window.matchMedia(DARK_PREFERENCE).matches;
	const darkmode = persisted(STORAGE_KEY, prefersDarkThemes());

	const toggleTheme = () => {
		$darkmode = !$darkmode;
	};

	const theme = (node: HTMLElement, dark: boolean) => {
		node.classList.toggle('dark', dark);
		return {
			update: (val: boolean) => node.classList.toggle('dark', val)
		};
	};
</script>

<svelte:body use:theme={$darkmode} />

<button on:click={toggleTheme}>&#9728;</button>

<style>
	button {
		padding: 0 0.25rem;
		background-color: var(--color-dark);
		line-height: 1.5rem;
	}
</style>
