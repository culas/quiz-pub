<script lang="ts">
	import { goto } from '$app/navigation';

	let joinCode = '';
	const codeLength = 6;
</script>

<h2 class="h2">Join Quiz</h2>

<form on:submit|preventDefault={() => goto('play/' + joinCode)}>
	<label class="flex flex-wrap items-end gap-2 label">
		<span class="w-full">Enter join code</span>
		<input
			class="input flex-1"
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
