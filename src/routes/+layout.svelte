<script lang="ts">
	import { commands } from '$lib/data/command';
	import { SvelteDate } from 'svelte/reactivity';
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

{@render children()}
<Footer />
