import { StateEvent } from "./events.model.ts";
import { HostMessage, QuizInfo, SocketMessage } from "./messages.ts";

interface Player {
  session: WebSocket;
  name?: string;
}

export class QuizSession {
  public players: Player[] = [];
  public name = "";
  public questions = 0;
  public rounds = 0;
  public host?: WebSocket;
  public onClose?: () => void;
  private lastHostMessage?: string;

  constructor(
    public adminCode: string,
    public joinCode: string,
    host: WebSocket,
  ) {
    this.addHost(host);
  }

  public addHost(socket: WebSocket) {
    this.host = socket;
    socket.onmessage = (msg) => {
      const data = this.parse<HostMessage>(msg);
      if (data.type === "quiz-info") {
        this.name = data.name;
        this.rounds = data.rounds;
        this.questions = data.questions;
        this.broadcast(this.getQuizInfo());
      } else {
        this.players.forEach((player) => player.session.send(msg.data));
        this.lastHostMessage = msg.data;
      }
    };
    socket.onclose = () => {
      this.host = undefined;
      if (this.hasSessionEnded()) {
        this.onClose?.();
      }
    };
  }

  public addPlayer(socket: WebSocket) {
    const player = { session: socket, color: this.getPlayerColor() } as Player;
    this.players.push(player);
    socket.onopen = () =>
      this.lastHostMessage && socket.send(this.lastHostMessage);
    socket.onmessage = (msg) => {
      const data = this.parse(msg);
      if (data.type === "join-quiz") {
        player.name = data.name;
        this.broadcastPlayers();
        socket.send(JSON.stringify(this.getQuizInfo()));
      } else if (data.type === "answers" || data.type === "ANSWER") {
        this.host?.send(msg.data);
      }
    };
    socket.onclose = () => {
      this.players = this.players.filter((p) => p.name !== player.name);
      if (this.hasSessionEnded()) {
        this.onClose?.();
      } else {
        this.broadcastPlayers();
      }
    };
  }

  private broadcastPlayers() {
    this.broadcast({
      type: "PLAYERS",
      players: this.players.map(({ name }) => ({
        name: name ?? "noname",
      })),
    });
  }

  private broadcast(msg: SocketMessage | StateEvent) {
    const message = JSON.stringify(msg);
    this.host?.send(message);
    this.players.forEach((p) => p.session.send(message));
  }

  private getPlayerColor(): string {
    return "var(--color-primary)";
  }

  private getQuizInfo(): QuizInfo {
    return {
      type: "quiz-info",
      name: this.name,
      rounds: this.rounds,
      questions: this.questions,
      players: this.players.map(({ name }) => ({
        name: name ?? "",
      })),
    };
  }

  private hasSessionEnded(): boolean {
    return this.host === undefined && this.players.length === 0;
  }

  private parse<T extends SocketMessage | StateEvent>(
    msg: MessageEvent<string>,
  ): T {
    return JSON.parse(msg.data);
  }
}
