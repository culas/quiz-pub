<script>
	import { runs } from '$lib/stores/runs.store';
	import { title } from '$lib/stores/title.store';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	$title = 'Run';
	$: showFinished = false;
	$: quizzes = $runs
		.filter((r) => !r.done || showFinished)
		.map((r) => r)
		.sort((r) => (r.done ? 1 : -1));
</script>

<h1>Quiz Runs</h1>

<p>Quizzes you are currently running or have run in the past.</p>

{#each quizzes as quiz}
	<section class="card shadow-lg my-4" class:opacity-60={quiz.done}>
		<h2 class="h2 card-header">{quiz.context.name}</h2>
		<ul class="p-4 list-disc list-inside">
			<li>State: {quiz.done ? 'finished' : 'running'}</li>
			<li>Players: {quiz.context.players.length}</li>
			<li>Join Code: <b>{quiz.context.joinCode}</b></li>
		</ul>
		<footer class="card-footer">
			<a class="button" href="run/{quiz.context.adminCode}">Open</a>
		</footer>
	</section>
{:else}
	<p class="my-4 italic opacity-50">No quizzes yet…</p>
{/each}

<SlideToggle name="slider-label" active="bg-error-500" bind:checked={showFinished}>Show finished quizzes</SlideToggle>
