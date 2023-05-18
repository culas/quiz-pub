<script>
	import JoinForm from '$lib/components/JoinForm.svelte';
	import { title } from '$lib/stores/title.store';

	$title = 'Play';
</script>

<h1>Play Quiz</h1>

<p>Enter the code you got from the host to join a quiz.</p>

<JoinForm />

