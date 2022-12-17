import { derived, writable, type Writable } from 'svelte/store';

const appName = 'QuizPub';

export const title = writable<string>(appName);

export const fullTitle = derived<Writable<string>, string>(title, (t, set) =>
	t === appName || t === '' ? set(appName) : set(`${appName} | ${t}`)
);
