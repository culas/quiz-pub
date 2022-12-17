<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let name = '';
	const minlength = 2;
	const maxlength = 12;
	const dispatch = createEventDispatcher<{ submit: string }>();
</script>

<form on:submit|preventDefault={() => dispatch('submit', name)}>
	<label>
		<input type="text" name="name" {minlength} {maxlength} placeholder="NAME" bind:value={name} />
	</label>
	<button disabled={name.length < minlength || name.length > maxlength} type="submit">Join</button>
</form>

<style>
	form {
		display: flex;
		align-items: flex-end;
		gap: 0.5rem;
	}

	label {
		flex-grow: 1;
	}
</style>
