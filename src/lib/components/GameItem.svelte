<script lang="ts">
	import type { Game } from '$lib/types/game';

	interface GameItemProps {
		game: Game;
		isSelected: boolean;
		updateMetrics: () => void;
		onBind: (el: HTMLAnchorElement) => void;
		onmouseenter: () => void;
	}

	let { game, isSelected, updateMetrics, onBind, onmouseenter }: GameItemProps = $props();

	let anchor = $state<HTMLAnchorElement | null>(null);

	$effect(() => {
		if (anchor) {
			onBind(anchor);
		}
	});
</script>

<a
	href={game.link}
	target="_blank"
	tabindex="0"
	bind:this={anchor}
	class="border-4 border-transparent {isSelected ? 'rounded-md  border-violet-700' : ''}"
	{onmouseenter}
	onclick={updateMetrics}
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
