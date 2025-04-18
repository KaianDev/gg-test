<script lang="ts">
	import GameItem from '$lib/components/GameItem.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import SearchDialog from '$lib/components/SearchDialog.svelte';
	import { games } from '$lib/data/games';
	import { metrics } from '$lib/data/metrics';

	import { onMount } from 'svelte';

	let selectedGame = $state(0);
	let searchQuery = $state('');
	let open = $state(false);
	let grid = 3;

	const listGames = $state(games);

	const filteredGames = $derived(
		listGames.filter((game) => game.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
	);

	const updateGameMetrics = (index: number) => {
		metrics.update((m) => {
			m.gamesOpened += 1;
			const gameIndex = $metrics.titleMostOpened.findIndex(
				(i) => i.game === filteredGames[index].title
			);

			if (gameIndex > -1) {
				m.titleMostOpened[gameIndex].count += 1;
			} else {
				m.titleMostOpened.push({
					count: 1,
					game: filteredGames[index].title
				});
			}
			return m;
		});

		localStorage.setItem('@gg/metrics', JSON.stringify($metrics));
	};

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
			open = !open;
		} else if (e.key === 'Enter') {
			e.preventDefault();
			updateGameMetrics(selectedGame);
			window.open(filteredGames[selectedGame].link, '_blank');
		} else if (e.key === 'Escape') {
			open = false;
		}
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	onMount(() => {
		const metricsFromStorage = localStorage.getItem('@gg/metrics');
		if (metricsFromStorage) {
			metrics.set(JSON.parse(metricsFromStorage));
		}
	});

	$inspect($metrics);
</script>

<svelte:head>
	<title>Home | GG test</title>
</svelte:head>

<div class="min-h-dvh bg-zinc-900 text-zinc-50">
	<header
		class="flex h-25 items-center justify-between border-b-2 border-indigo-700 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-700 px-6"
	>
		<Logo />

		<div class="flex items-center gap-4">
			<div>
				<input
					class="border-input ring-offset-background flex h-10 w-full rounded-md border bg-zinc-900 px-3 py-2 text-base placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
					placeholder="Pesquisar"
					bind:value={searchQuery}
				/>
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl space-y-6 p-6">
		<h1 class="text-2xl font-bold text-indigo-700">Mais jogados</h1>
		<div class="pb-20" style="grid-template-columns: repeat({grid},1fr); display:grid; gap:0.5rem">
			{#each filteredGames as game, index}
				<GameItem
					{game}
					updateMetrics={() => updateGameMetrics(index)}
					isSelected={selectedGame === index}
				/>
			{/each}
		</div>
	</main>
</div>

{#if open}
	<SearchDialog bind:searchQuery {open} />
{/if}
