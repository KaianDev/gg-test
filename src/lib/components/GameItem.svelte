<script lang="ts">
	import type { Game } from '$lib/types/game';

	interface GameItemProps {
		game: Game;
		isSelected: boolean;
		updateMetrics: () => void;
		onmouseenter: () => void;
		onbind: (el: HTMLAnchorElement) => void;
	}


	let { game, isSelected, updateMetrics, onmouseenter, onbind }: GameItemProps = $props();
	let element: HTMLAnchorElement = $state(null!);
	$effect(() => {
		if (element) {
			onbind(element);
		}
	});
</script>

<a
	href={game.link}
	target="_blank"
	tabindex="0"
	class="border-4 border-transparent cursor-pointer {isSelected ? 'rounded-md  border-violet-700' : ''}"
	onclick={updateMetrics}
	onmouseenter={onmouseenter}
	bind:this={element}
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
