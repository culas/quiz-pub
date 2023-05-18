<script lang="ts">
	import { page } from '$app/stores';
	import { saves } from '$lib/stores/saves.store';
	import { title } from '$lib/stores/title.store';
	import type { QuizSave } from 'src/lib/models/quiz-save.model';

	$: quiz = $saves.find((save: QuizSave) => save.id === $page.params.code) ?? {
		id: $page.params.code,
		name: '',
		rounds: [],
		date: Date.now(),
		deleted: false
	};
	$: $title = `Edit «${quiz?.name}»`;

	function addRound() {
		quiz.rounds = [...quiz.rounds, { name: '', questions: [''] }];
	}

	function addQuestion(rIdx: number) {
		const round = quiz.rounds[rIdx];
		round.questions = [...round.questions, ''];
		quiz.rounds = quiz.rounds.map((r, i) => (i === rIdx ? round : r));
	}

	function removeQuestion(rIdx: number, qIdx: number) {
		quiz.rounds = quiz.rounds.map((r, i) =>
			i === rIdx ? { ...r, questions: r.questions.filter((_, i) => i !== qIdx) } : r
		);
	}

	function removeRound(rIdx: number) {
		quiz.rounds = quiz.rounds.filter((_, i) => i !== rIdx);
	}

	function save() {
		quiz.date = Date.now();
		$saves = [...$saves.filter((q) => q.id !== quiz.id), quiz];
	}

	$: disabled =
		quiz.name.length < 3 ||
		quiz.rounds.length === 0 ||
		quiz.rounds.some(
			(r) => r.name.length < 3 || r.questions.length === 0 || r.questions.some((q) => q.length < 3)
		);
</script>

<h1>Edit Quiz «{quiz.name}»</h1>

<form on:submit|preventDefault={save}>
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
				<button type="button" class="warn" on:click={() => removeRound(rIdx)}>delete round</button>
			</label>

			{#each round.questions as question, qIdx}
				<label>
					<h3>Q{qIdx + 1}</h3>
					<input type="text" bind:value={question} />
					<button type="button" class="warn" on:click={() => removeQuestion(rIdx, qIdx)}
						>delete question</button
					>
				</label>
			{/each}
			<button type="button" on:click={() => addQuestion(rIdx)}>add question</button>
		</section>
	{/each}

	<section>
		<button type="button" on:click={addRound}>add round</button>
	</section>

	<button {disabled} type="submit">save</button>
</form>

<style>
	label {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		margin-bottom: 1rem;
		gap: 0.5rem;
	}

	label h2,
	label h3 {
		width: 100%;
	}

	label input {
		width: auto;
		flex-grow: 1;
	}
</style>
