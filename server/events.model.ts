export type StateEvent =
  | JoinEvent
  | LeaveEvent
  | StartEvent
  | AnswerEvent
  | SkipAnswersEvent
  | RevealEvent
  | ScoreEvent
  | ConfirmScoreEvent;

export interface PlayersEvent {
  type: "PLAYERS";
  players: { name: string }[];
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
}

export interface ScoreEvent {
  type: "SCORE";
  rIdx: number;
  qIdx: number;
  player: string;
  score: number;
}

export interface ConfirmScoreEvent {
  type: "CONFIRMSCORE";
}

export interface JoinEvent {
  type: "JOIN";
  name: string;
}

export interface LeaveEvent {
  type: "LEAVE";
  name: string;
}
