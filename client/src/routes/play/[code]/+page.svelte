<script lang="ts">
	import { page } from '$app/stores';
	import { connectSocket } from '$lib/utils/websocket';

	const socket = connectSocket(new Map([['joinCode', $page.params.code]]));
	let name = '';
	function join() {
		$socket = { type: 'join-quiz', name };
	}
</script>

<form on:submit|preventDefault={join}>
	<label>
		Name
		<input type="text" name="name" bind:value={name} />
	</label>
	<button type="submit">Join</button>
</form>
