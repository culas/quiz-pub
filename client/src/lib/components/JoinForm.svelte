<script lang="ts">
	import { goto } from '$app/navigation';

	let joinCode = '';
	const codeLength = 6;
	$: disabled = joinCode.length !== codeLength;
</script>

<form on:submit|preventDefault={() => goto('play/' + joinCode.toUpperCase())}
      class="card shadow-lg my-4">
	<h2 class="h2 card-header">Join Quiz</h2>
	<label class="flex flex-wrap items-end gap-x-2 label p-4">
		<span class="w-full">Enter the {codeLength}-character join code</span>
		<input
			class="input flex-1 uppercase"
			type="text"
			minlength={codeLength}
			maxlength={codeLength}
			name="joinCode"
			placeholder="CODE"
			bind:value={joinCode}
		/>
		<button class="button variant-filled-primary" {disabled} type="submit">Join</button>
	</label>
</form>
