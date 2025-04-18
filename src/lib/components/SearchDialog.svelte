<script>
	import { fly } from 'svelte/transition';

	let { searchQuery = $bindable(''), open } = $props();
</script>

<!-- svelte-ignore a11y_unknown_role -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	role="scape"
	aria-roledescription="button"
	class="fixed inset-0 z-50 mt-2 flex items-start justify-center bg-zinc-900/20"
>
	<div
		transition:fly={{ y: -200, duration: 300 }}
		class="w-full max-w-md rounded-md border border-transparent bg-zinc-900 p-4 shadow"
	>
		<input
			autofocus
			class="border-input ring-offset-background flex h-10 w-full rounded-md border bg-zinc-900 px-3 py-2 text-base text-zinc-50 placeholder:text-zinc-400 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
			placeholder="Pesquisar"
			type="text"
			bind:value={searchQuery}
			list="game-list"
			tabindex="0"
		/>
		<datalist id="game-list">
			<option value="God of War"></option>
			<option value="Resident Evil 4"></option>
			<option value="The Witcher 3"></option>
		</datalist>
	</div>
</div>
