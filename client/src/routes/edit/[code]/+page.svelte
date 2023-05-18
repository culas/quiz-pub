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

<header class="flex flex-wrap items-start">
	<h1 class="flex-1">Edit Quiz «{quiz.name}»</h1>
	<button {disabled} title={disabled ? 'Not all fields filled' : null} type="submit">save</button>
</header>

<form on:submit|preventDefault={save}>
	<section class="card shadow-lg my-4 p-4">
		<label class="label">
			<span>Name of the quiz</span>
			<input class="input" type="text" bind:value={quiz.name} />
		</label>
	</section>

	{#each quiz.rounds as round, rIdx}
		<section class="card shadow-lg my-4 p-4">
			<h2 class="h2 mb-2">Round {rIdx + 1}</h2>
			<label class="label mb-4">
				<span>Name of this round</span>
				<div class="flex gap-2">
					<input class="input" type="text" placeholder="Round name" bind:value={round.name} />
					<button type="button" class="variant-filled-error" on:click={() => removeRound(rIdx)}>delete round</button>
				</div>
			</label>

			<hr class="my-4 opacity-50">

			{#each round.questions as question, qIdx}
				<label class="label mb-4">
					<div class="flex gap-2">
						<div class="input-group input-group-divider grid-cols-[auto_1fr]">
							<div class="input-group-shim">Q{rIdx + 1}-{qIdx + 1}</div>
							<input type="text" placeholder="Question" bind:value={question} />
						</div>
						<button type="button" class="variant-filled-error" on:click={() => removeQuestion(rIdx, qIdx)}>delete</button>
					</div>
				</label>
			{/each}
			<button type="button" on:click={() => addQuestion(rIdx)}>add question</button>
		</section>
	{/each}

	<section class="flex justify-between my-4">
		<button type="button" on:click={addRound}>add round</button>
		<button {disabled} title={disabled ? 'Not all fields filled' : null} type="submit">save</button>
	</section>
</form>
