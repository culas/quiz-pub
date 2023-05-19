<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let name = '';
	const minlength = 2;
	const maxlength = 12;
	const dispatch = createEventDispatcher<{ submit: string }>();
	$: disabled = name.length < minlength || name.length > maxlength;
</script>

<form on:submit|preventDefault={() => dispatch('submit', name)}
      class="card shadow-lg my-4">
	<label class="flex flex-wrap items-end gap-x-2 label p-4">
		<span class="w-full">Enter your name</span>
		<input
			class="input flex-1"
			type="text"
			{minlength}
			{maxlength}
			name="name"
			placeholder="Name"
			bind:value={name}
		/>
		<button class="button variant-filled-primary" {disabled} type="submit">Join</button>
	</label>
	<p class="card-footer">Note: your name will be visible to the host and all other players.</p>
</form>
