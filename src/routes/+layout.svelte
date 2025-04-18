<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	onMount(() => {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
				e.preventDefault();
				document.body.classList.add('cursor-none');
				document.body.classList.remove('cursor-auto');
			}
		});
		document.addEventListener('mousemove', (e) => {
			document.body.classList.add('cursor-auto');
			document.body.classList.remove('cursor-none');
		});
	});
</script>

{@render children()}
<Footer />
