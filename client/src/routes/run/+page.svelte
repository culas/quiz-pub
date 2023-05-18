<script>
	import { runs } from '$lib/stores/runs.store';
	import { title } from '$lib/stores/title.store';

	$title = 'Run';
	$: showFinished = false;
	$: quizzes = $runs
		.filter((r) => !r.done || showFinished)
		.map((r) => r)
		.sort((r) => (r.done ? 1 : -1));
</script>

<h1>Quiz Runs</h1>

{#each quizzes as quiz}
	<section class:disabled={quiz.done}>
		<h2>{quiz.context.name}</h2>
		<p>State: {quiz.done ? 'finished' : 'running'}</p>
		<p>Players: {quiz.context.players.length}</p>
		<p>Join Code: <b>{quiz.context.joinCode}</b></p>
		<a class="btn variant-glass-primary" href="run/{quiz.context.adminCode}">Open</a>
	</section>
{/each}
<button on:click={() => (showFinished = !showFinished)}
	>{showFinished ? 'hide' : 'show'} finished</button
>
