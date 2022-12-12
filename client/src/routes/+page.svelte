<script lang="ts">
	import { goto } from '$app/navigation';
	let joinCode = '';
</script>

<h1>QuizPub</h1>

<p>Create, run and play pub quizzes with your friends.</p>

<form on:submit|preventDefault={() => goto('play/' + joinCode)}>
	<label>
		<h2>Join Quiz</h2>
		<input type="text" name="joinCode" placeholder="CODE" bind:value={joinCode} />
		<button type="submit" disabled={joinCode.length !== 6}>JOIN</button>
	</label>
</form>

<p>Run your own quizzes:</p>
<ul>
	<li>
		<a href="/edit">create and edit quizzes</a>
	</li>
	<li>
		<a href="/run">run quizzes</a>
	</li>
</ul>

<style>
	form {
		margin: 2rem 0;
	}

	label {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 0.5rem;
	}

	label h2 {
		width: 100%;
	}

	label input {
		width: auto;
		flex-grow: 1;
	}
</style>
