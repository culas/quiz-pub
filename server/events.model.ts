export type StateEvent =
  | JoinEvent
  | StartEvent
  | AnswerEvent
  | SkipAnswersEvent
  | RevealEvent
  | ScoreEvent
  | ConfirmScoreEvent;

export interface JoinEvent {
  type: "PLAYERS";
  players: { name: string; color: string }[];
}

export interface StartEvent {
  type: "START";
}

export interface AnswerEvent {
  type: "ANSWER";
  player: string;
  answers: string[];
}

export interface SkipAnswersEvent {
  type: "SKIPANSWERS";
}

export interface RevealEvent {
  type: "REVEAL";
  qIdx: number;
  player: string;
}

export interface ScoreEvent {
  type: "SCORE";
  rIdx: number;
  qIdx: number;
  player: string;
  score: number;
}

export interface ConfirmScoreEvent {
  type: 'CONFIRMSCORE';
}
