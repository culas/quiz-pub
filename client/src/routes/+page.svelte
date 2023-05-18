<script lang="ts">
	import JoinForm from '$lib/components/JoinForm.svelte';
	import { title } from '$lib/stores/title.store';

	$title = '';
</script>

<h1>QuizPub</h1>

<p>Create, run and play pub quizzes with your friends.</p>

<JoinForm />

<p>Run your own quizzes:</p>
<ul>
	<li>
		<a class="anchor" href="/edit">create and edit quizzes</a>
	</li>
	<li>
		<a class="anchor" href="/run">run quizzes</a>
	</li>
</ul>
