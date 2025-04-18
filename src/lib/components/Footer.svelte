<script>
	import { commands } from '$lib/data/command';

	import { SvelteDate } from 'svelte/reactivity';
</script>

<footer
	class="fixed inset-x-0 bottom-0 flex h-15 items-center justify-between gap-4 bg-gradient-to-r from-zinc-900/50 via-zinc-900 to-indigo-700 p-6"
>
	<p class="text-zinc-500">
		&copy; {new SvelteDate().getFullYear()} -
		<a
			href="https://github.com/KaianDev"
			target="_blank"
			class="hover:text-orange-500 hover:underline"
		>
			Kaian Dev
		</a>
	</p>
	<div class="flex items-center gap-2">
		{#each commands as item, index (item.id)}
			<div class="flex items-center gap-1">
				<p title={item.description} class="text-zinc-50">
					{item.name}
				</p>
				{#each item.keys as key, kIndex}
					<kbd
						class="min flex h-8 min-w-8 items-center justify-center rounded-md border-r border-b border-zinc-400 bg-zinc-100 p-1 text-sm leading-0 select-none"
						>{@html key}
					</kbd>
					<span class="text-zinc-50"
						>{kIndex !== item.keys.length - 1 && item.concat ? '+' : ''}
						{kIndex !== item.keys.length - 1 && item.or ? 'ou' : ''}</span
					>
				{/each}
			</div>
			{#if index !== commands.length - 1}
				<hr class="h-10 w-0.5 bg-zinc-50/50" />
			{/if}
		{/each}
	</div>
</footer>
