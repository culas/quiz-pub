import { writable, type Writable } from 'svelte/store';
import type { QuizSave } from '../models/quiz-save.model';

const lsKey = 'quizSaves';

const initialValue = localStorage.getItem(lsKey);
export const saves: Writable<QuizSave[]> = writable(initialValue ? JSON.parse(initialValue) : []);

saves.subscribe(value => localStorage.setItem(lsKey, JSON.stringify(value)));