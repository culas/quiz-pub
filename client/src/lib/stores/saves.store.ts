import type { QuizSave } from '$lib/models/quiz-save.model';
import { writable } from 'svelte-local-storage-store';
import type { Writable } from 'svelte/store';

export const saves: Writable<QuizSave[]> = writable('quizSaves', []);