<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import GameItem from '$lib/components/GameItem.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import SearchDialog from '$lib/components/SearchDialog.svelte';
	import { games } from '$lib/data/games';
	import { metrics } from '$lib/data/metrics';
	import { Direction } from '$lib/types/direction';

	import { onMount } from 'svelte';

	let selectedGame = $state(0);
	let searchQuery = $state('');
	let open = $state(false);
	let grid = 3;

	const listGames = $state(games);
	const gameItemElements: HTMLAnchorElement[] = $state([]);
	let previousButtonStates = $state({
		axesY: 0,
		axesX: 0,
		buttonA: false,
		buttonB: false
	});
	let applicationMode = $state<'keyboard' | 'gamepad'>('keyboard');

	const DEADZONE = 0.5;

	const filteredGames = $derived(
		listGames.filter((game) => game.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
	);

	const updateApplicationMode = (mode: 'keyboard' | 'gamepad') => {
		if (applicationMode === mode) return;
		applicationMode = mode;
	};

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

	const isElementInViewport = (element: HTMLElement): boolean => {
		const { top, bottom, left, right } = element.getBoundingClientRect();
		const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

		return top >= 0 && left >= 0 && bottom <= viewportHeight && right <= viewportWidth;
	};

	const smoothScroll = (direction: 'next' | 'prev') => {
		const elementIsInViewport = isElementInViewport(gameItemElements[selectedGame]);
		if (elementIsInViewport) return;

		if (direction === 'prev') {
			gameItemElements[selectedGame].scrollIntoView({
				behavior: 'smooth',
				block: 'end'
			});
		} else {
			gameItemElements[selectedGame].scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	};

	const handleMove = (direction: Direction) => {
		switch (direction) {
			case Direction.LEFT:
				selectedGame = Math.max(0, selectedGame - 1);
				smoothScroll('prev');
				break;
			case Direction.RIGHT: {
				selectedGame = Math.min(filteredGames.length - 1, selectedGame + 1);
				smoothScroll('next');
				break;
			}
			case Direction.DOWN: {
				selectedGame = Math.min(filteredGames.length - 1, selectedGame + grid);
				smoothScroll('next');
				break;
			}
			case Direction.UP: {
				selectedGame = Math.max(0, selectedGame - grid);
				smoothScroll('prev');
				break;
			}
			default:
				return;
		}
	};

	const openGamePage = () => {
		updateGameMetrics(selectedGame);
		window.open(filteredGames[selectedGame].link, '_blank');
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		const specialKey = e.altKey || e.ctrlKey || e.metaKey;

		if (e.key === 'ArrowLeft' && !specialKey) {
			handleMove(Direction.LEFT);
			updateApplicationMode('keyboard');
		} else if (e.key === 'ArrowRight' && !specialKey) {
			handleMove(Direction.RIGHT);
			updateApplicationMode('keyboard');
		} else if (e.key === 'ArrowDown') {
			handleMove(Direction.DOWN);
			updateApplicationMode('keyboard');
		} else if (e.key === 'ArrowUp') {
			handleMove(Direction.UP);
			updateApplicationMode('keyboard');
		} else if (e.key.toLowerCase() === 'k' && e.ctrlKey) {
			e.preventDefault();
			open = !open;
			updateApplicationMode('keyboard');
		} else if (e.key === 'Enter') {
			e.preventDefault();
			openGamePage();
			updateApplicationMode('keyboard');
		} else if (e.key === 'Escape') {
			open = false;
		}
	};

	const hideMouseCursor = () => {
		document.body.classList.add('cursor-none');
		document.body.classList.remove('cursor-auto');
	};

	const updateGamepad = () => {
		let gp = navigator.getGamepads()[0];
		if (gp) {
			const axesX = gp.axes[0] ?? 0;
			const axesY = gp.axes[1] ?? 0;

			const buttonA = gp.buttons[1];
			const buttonB = gp.buttons[2];

			if (axesX > DEADZONE && previousButtonStates.axesX <= DEADZONE) {
				handleMove(Direction.RIGHT);
				hideMouseCursor();
				updateApplicationMode('gamepad');
			} else if (axesX < -DEADZONE && previousButtonStates.axesX >= -DEADZONE) {
				handleMove(Direction.LEFT);
				hideMouseCursor();
				updateApplicationMode('gamepad');
			}

			if (axesY > DEADZONE && previousButtonStates.axesY <= DEADZONE) {
				handleMove(Direction.DOWN);
				hideMouseCursor();
				updateApplicationMode('gamepad');
			} else if (axesY < -DEADZONE && previousButtonStates.axesY >= -DEADZONE) {
				handleMove(Direction.UP);
				hideMouseCursor();
				updateApplicationMode('gamepad');
			}

			if (buttonA.pressed && !previousButtonStates.buttonA) {
				openGamePage();
				hideMouseCursor();
				updateApplicationMode('gamepad');
			}

			if (buttonB.pressed && !previousButtonStates.buttonB) {
				openGamePage();
				hideMouseCursor();
				updateApplicationMode('gamepad');
			}

			previousButtonStates = {
				axesX,
				axesY,
				buttonA: buttonA.pressed,
				buttonB: buttonB.pressed
			};
		}

		requestAnimationFrame(updateGamepad);
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

	onMount(() => {
		window.addEventListener('gamepadconnected', (e) => {
			console.log(e.gamepad);
			updateGamepad();
		});

		return () => {
			window.removeEventListener('gamepadconnected', updateGamepad);
		};
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
					onmouseenter={() => (selectedGame = index)}
					onBind={(el: HTMLAnchorElement) => {
						gameItemElements[index] = el;
					}}
				/>
			{/each}
		</div>
	</main>
</div>

{#if open}
	<SearchDialog bind:searchQuery {open} />
{/if}

<Footer mode={applicationMode} />
