<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let name = '';
	const dispatch = createEventDispatcher<{ submit: string }>();
</script>

<form on:submit|preventDefault={() => dispatch('submit', name)}>
	<label>
		<input type="text" name="name" placeholder="NAME" bind:value={name} />
	</label>
	<button disabled={name.length < 2 || name.length > 12} type="submit">Join</button>
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
