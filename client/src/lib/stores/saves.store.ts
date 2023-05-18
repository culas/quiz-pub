import type { QuizSave } from '$lib/models/quiz-save.model';
import { persisted } from 'svelte-local-storage-store';
import type { Writable } from 'svelte/store';

export const saves: Writable<QuizSave[]> = persisted('quizSaves', []);
