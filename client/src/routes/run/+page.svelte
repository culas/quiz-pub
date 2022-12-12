<script>
	import { runs } from '$lib/stores/runs.store';

	$: showFinished = false;
</script>

<h1>Quiz Runs</h1>

{#each $runs.filter((r) => !r.done || showFinished).map((r) => r.context) as quiz}
	<section>
		<h2>{quiz.name}</h2>
		<!-- <p>State: {quiz.state}</p> -->
		<p>Players: {quiz.players.length}</p>
		<p>Join Code: <b>{quiz.joinCode}</b></p>
		<a class="button" href="run/{quiz.adminCode}">Open</a>
	</section>
{/each}
<button on:click={() => (showFinished = !showFinished)}
	>{showFinished ? 'hide' : 'show'} finished</button
>
