import { writable } from 'svelte/store';

interface TitleMostOpened {
	game: string;
	count: number;
}

interface Metrics {
	gamesOpened: number;
	titleMostOpened: TitleMostOpened[];
}

export const metrics = writable<Metrics>({
	gamesOpened: 0,
	titleMostOpened: [] as TitleMostOpened[]
});
