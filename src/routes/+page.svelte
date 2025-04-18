<script lang="ts">
	import { games } from '$lib/data/games';
	import { onMount } from 'svelte';

	let selectedGame = $state(0);
	let searchQuery = $state('');
	let searchInput: HTMLInputElement;
	let grid = 3;

	const listGames = $state(games);

	const filteredGames = $derived(
		listGames.filter((game) => game.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const handleKeyDown = (e: KeyboardEvent) => {
		const specialKey = e.altKey || e.ctrlKey || e.metaKey;
		if (e.key === 'ArrowLeft' && !specialKey) {
			selectedGame = Math.max(0, selectedGame - 1);
		} else if (e.key === 'ArrowRight' && !specialKey) {
			selectedGame = Math.min(filteredGames.length - 1, selectedGame + 1);
		} else if (e.key === 'ArrowDown') {
			selectedGame = Math.min(filteredGames.length - 1, selectedGame + grid);
		} else if (e.key === 'ArrowUp') {
			selectedGame = Math.max(0, selectedGame - grid);
		} else if (e.key.toLowerCase() === 'k' && e.ctrlKey) {
			e.preventDefault();
			searchInput.focus();
		} else if (e.key === 'Enter') {
			e.preventDefault();
			window.open(filteredGames[selectedGame].link, '_blank');
		}
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<div class="min-h-dvh bg-zinc-900 text-zinc-50">
	<header class="flex items-center justify-between border-b-2 border-violet-700 bg-zinc-800 p-4">
		<h1 class="text-4xl font-semibold">gg test</h1>

		<div>
			<input
				class="rounded-md border-1 border-zinc-700 text-zinc-900 placeholder-zinc-600 ring-0 ring-offset-2 ring-offset-transparent focus-visible:ring-offset-violet-700"
				placeholder="Pesquisar"
				bind:this={searchInput}
				type="text"
				bind:value={searchQuery}
			/>
		</div>
	</header>

	<main class="mx-auto max-w-7xl space-y-6 p-6">
		<h1 class="text-2xl font-bold text-violet-700">Mais jogados</h1>
		<div class="pb-20" style="grid-template-columns: repeat({grid},1fr); display:grid; gap:0.5rem">
			{#each filteredGames as game, index}
				<a
					href={game.link}
					target="_blank"
					tabindex="0"
					class="border-4 border-transparent {selectedGame === index
						? 'rounded-md  border-violet-700'
						: ''}"
				>
					<div class="relative overflow-hidden rounded-xs">
						<img src={game.cover} alt={game.title} />
						<h2
							class="absolute inset-x-0 bottom-0 flex h-15 items-end bg-gradient-to-b from-transparent from-10% via-zinc-900/60 via-70% to-zinc-900/80 to-90% p-1 font-semibold"
						>
							{game.title}
						</h2>
					</div>
				</a>
			{/each}
		</div>
	</main>
</div>
