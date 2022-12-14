<script lang="ts">
	import type { Answer } from '$server-interface/messages';
	export let answers: Answer[] = [];
	export let rounds: { id: number; text: string }[] = [];
	$: console.log(rounds);
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
		{#each scores as player, i}
			<tr>
				<td>{i + 1}</td>
				<td>{player.player}</td>
				{#each player.rounds as round}
					<td class="right">{round}</td>
				{/each}
				<td class="right"><b>{player.scores}</b></td>
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
