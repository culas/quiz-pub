import { StateEvent } from "./events.model.ts";
import { SocketMessage } from "./messages.ts";

interface Player {
  session: WebSocket;
  name?: string;
}

export class QuizSession {
  public players: Player[] = [];
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
      this.players.forEach((player) => player.session.send(msg.data));
      this.lastHostMessage = msg.data;
    };
    socket.onclose = () => {
      this.host = undefined;
      if (this.hasSessionEnded()) {
        this.onClose?.();
      }
    };
  }

  public addPlayer(socket: WebSocket) {
    const player = { session: socket, color: 'var(--color-primary)' } as Player;
    this.players.push(player);
    socket.onopen = () =>
      this.lastHostMessage && socket.send(this.lastHostMessage);
    socket.onmessage = (msg) => {
      const data = this.parse(msg);
      if (data.type === "join-quiz") {
        player.name = data.name;
        this.broadcastPlayers();
      } else if (data.type === "ANSWER") {
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

  private hasSessionEnded(): boolean {
    return this.host === undefined && this.players.length === 0;
  }

  private parse<T extends SocketMessage | StateEvent>(
    msg: MessageEvent<string>,
  ): T {
    return JSON.parse(msg.data);
  }
}
