<script lang="ts">
	import JoinForm from '$lib/components/JoinForm.svelte';
	import { title } from '$lib/stores/title.store';

	$title = '';
</script>

<h1>QuizPub</h1>

<p>Create, run and play pub quizzes with your friends.</p>

<JoinForm />

<p>
	You can <a class="anchor" href="/edit">create</a> and then <a href="/run" class="anchor">run</a> your own quiz.
</p>
