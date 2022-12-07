<script lang="ts">
	import { page } from '$app/stores';
	$: code = $page.params.code;
</script>

<h1>Edit Quiz: {code}</h1>
