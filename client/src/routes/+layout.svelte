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

<AppShell slotPageFooter="p-2 text-xs bg-surface-100-800-token shadow-xl">
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

	<svelte:fragment slot="pageFooter">QuizPub: create, run and play pub quiz style events
		&#x2022; by celep for Fishcord
		&#x2022; <a class="anchor" href="https://github.com/culas/quiz-pub">GitHub</a>
	</svelte:fragment>
</AppShell>
