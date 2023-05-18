<script>
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.css';
	import Navigation from '$lib/components/Navigation.svelte';
	import { fullTitle } from '$lib/stores/title.store';
	import { AppBar, AppShell, LightSwitch, setInitialClassState } from '@skeletonlabs/skeleton';

	$: document.title = $fullTitle;
	setInitialClassState();
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar class="shadow-xl">
			<svelte:fragment slot="lead">
				<a class="font-bold text-xl" href="/">QuizPub</a>
			</svelte:fragment>
			<Navigation />
			<svelte:fragment slot="trail">
				<LightSwitch></LightSwitch>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<main>
		<slot />
	</main>

	<svelte:fragment slot="footer">
		QuizPub: create, run and play pub quiz style events &#x2022; by celep for Fishcord &#x2022; <a
		href="https://github.com/culas/quiz-pub">GitHub</a
	>
	</svelte:fragment>
</AppShell>
