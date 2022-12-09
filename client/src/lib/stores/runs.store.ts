import type { QuizRun } from '$lib/models/quiz-run.model';
import { writable } from 'svelte-local-storage-store';
import { derived, get, type Readable, type Writable } from 'svelte/store';

export const runCodes: Writable<string[]> = writable('quizRuns', []);

function isQuizRun(run: QuizRun | undefined): run is QuizRun {
	return run !== undefined;
}

const runStores = derived(runCodes, $runCodes => $runCodes.map(code => writable<QuizRun | undefined>(code, undefined)));
export const runs: Readable<QuizRun[]> = derived(runStores, $runs => $runs.map(r => get(r)).filter(isQuizRun));
