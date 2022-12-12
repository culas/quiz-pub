import type { StateEvent } from '$server-interface/events.model';
import type { QuizState } from '$server-interface/messages';
import { writable } from 'svelte-local-storage-store';
import { derived, get, type Readable, type Writable } from 'svelte/store';
import type { State } from 'xstate';

export const runCodes: Writable<string[]> = writable('quizRuns', []);

function isQuizRun(run: State<QuizState, StateEvent> | undefined): run is State<QuizState, StateEvent> {
	return run !== undefined;
}

const runStores = derived(runCodes, $runCodes => $runCodes.map(code => writable<State<QuizState, StateEvent> | undefined>(code, undefined)));
export const runs: Readable<State<QuizState, StateEvent>[]> = derived(runStores, $runs => $runs.map(r => get(r)).filter(isQuizRun));
