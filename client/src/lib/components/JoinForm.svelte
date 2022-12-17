<script lang="ts">
	import { goto } from '$app/navigation';
	let joinCode = '';
	const codeLength = 6;
</script>

<form on:submit|preventDefault={() => goto('play/' + joinCode)}>
	<label>
		<h2>Join Quiz</h2>
		<input
			type="text"
			minlength={codeLength}
			maxlength={codeLength}
			name="joinCode"
			placeholder="CODE"
			bind:value={joinCode}
		/>
		<button type="submit" disabled={joinCode.length !== codeLength}>JOIN</button>
	</label>
</form>

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
