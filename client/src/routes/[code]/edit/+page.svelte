<script lang="ts">
	import { page } from '$app/stores';
	import { saves } from '$lib/stores/saves.store';
	import type { QuizSave } from 'src/lib/models/quiz-save.model';
	$: quiz = $saves.find((save: QuizSave) => save.id === $page.params.code) ?? {
		id: $page.params.code,
		name: '',
		rounds: [],
		date: Date.now(),
		deleted: false
	};

	function addRound() {
		quiz.rounds = [...quiz.rounds, { name: '', questions: [''] }];
	}

	function addQuestion(rIdx: number) {
		const round = quiz.rounds[rIdx];
		round.questions = [...round.questions, ''];
		quiz.rounds = quiz.rounds.map((r, i) => (i === rIdx ? round : r));
	}

	function save() {
		quiz.date = Date.now();
		$saves = [...$saves.filter((q) => q.id !== quiz.id), quiz];
	}
</script>

<h1>Edit Quiz «{quiz.name}»</h1>

<section>
	<label>
		<h2>Name</h2>
		<input type="text" bind:value={quiz.name} />
	</label>
</section>

{#each quiz.rounds as round, rIdx}
	<section class="round">
		<label>
			<h2>Round</h2>
			<input type="text" bind:value={round.name} />
		</label>

		{#each round.questions as question, qIdx}
			<label>
				<h3>Q{qIdx + 1}</h3>
				<input type="text" bind:value={question} />
			</label>
		{/each}
		<button on:click={() => addQuestion(rIdx)}>Add question</button>
	</section>
{/each}

<section>
	<button on:click={addRound}>Add round</button>
</section>

<button on:click={save}>Save</button>
