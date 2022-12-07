<script lang="ts">
	import { page } from '$app/stores';
	import { saves } from '$lib/stores/saves.store';
	import type { QuizSave } from 'src/lib/models/quiz-save.model';
	$: quiz = $saves.find((save: QuizSave) => save.id === $page.params.code) ?? {id: $page.params.code, name: '', rounds: []};

	function addRound() {
		quiz.rounds = [...quiz.rounds, { name: '', questions: [''] }];
	}

	function addQuestion(rIdx: number) {
		const round = quiz.rounds[rIdx];
		round.questions = [...round.questions, ''];
		quiz.rounds = [...quiz.rounds.filter((_, i) => rIdx !== i), {...round}];
	}

	function save() {
		$saves = [...$saves.filter(q => q.id !== quiz.id), quiz];
	}
</script>

<h1>Edit Quiz: {quiz.id}</h1>

<label>
	<h2>Name</h2>
	<input type="text" bind:value={quiz.name} />
</label>

{#each quiz.rounds as round, rIdx}
	<article class="round">
		<label>
			<h3>Round</h3>
			<input type="text" bind:value={round.name} />
		</label>

		{#each round.questions as question, qIdx}
			<label>
				<h4>Question {qIdx}</h4>
				<input type="text" bind:value={question} />
			</label>
		{/each}
		<button on:click={() => addQuestion(rIdx)}>Add question</button>
	</article>
{/each}

<button on:click={addRound}>Add round</button>

<button on:click={save}>Save</button>
