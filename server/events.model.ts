export type StateEvent =
  | PlayersEvent
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

// not technically a state event but a msg from player to server
export interface JoinQuiz {
  type: "JOIN";
  name: string;
}
