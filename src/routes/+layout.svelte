<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	const handleKeyDown = (e: KeyboardEvent) => {
		if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
			e.preventDefault();
			document.body.classList.add('cursor-none');
			document.body.classList.remove('cursor-auto');
		}
	};

	const handleMouseMove = (e: MouseEvent) => {
		document.body.classList.remove('cursor-none');
		document.body.classList.add('cursor-auto');
	};

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

{@render children()}
