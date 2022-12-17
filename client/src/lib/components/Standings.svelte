<script lang="ts">
	import type { Answer, Round } from '$lib/models/quiz-state.model';

	export let answers: Answer[] = [];
	export let rounds: Round[] = [];
	export let player = '';

	$: players = answers.map((a) => a.player).reduce((acc, p) => acc.add(p), new Set());
	$: scores = [...players]
		.map((p) => ({
			player: p,
			scores: answers.filter((a) => a.player === p).reduce((acc, s) => acc + (s.score ?? 0), 0),
			rounds: answers
				.filter((a) => a.player === p)
				.reduce((acc, s) => {
					acc[s.roundId] = (acc[s.roundId] ?? 0) + (s.score ?? 0);
					return acc;
				}, new Array(rounds.length).fill(0))
		}))
		.sort((a, b) => b.scores - a.scores);
</script>

<table>
	<thead>
		<tr>
			<th>Place</th>
			<th>Player</th>
			{#each rounds as round}
				<th class="right">{round.text}</th>
			{/each}
			<th class="right">Total</th>
		</tr>
	</thead>
	<tbody>
		{#each scores as score, i}
			<tr class:highlight={score.player === player}>
				<td>{i + 1}</td>
				<td>{score.player}</td>
				{#each score.rounds as round}
					<td class="right">{round}</td>
				{/each}
				<td class="right"><b>{score.scores}</b></td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
		width: 100%;
	}

	thead tr,
	tbody tr:hover {
		background-color: var(--color-light);
	}

	tr.highlight {
		color: var(--color-primary);
		font-weight: bold;
	}

	th {
		text-align: left;
	}

	.right {
		text-align: right;
	}

	th,
	td {
		padding: 0.25rem;
	}
</style>
