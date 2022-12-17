export class QuizSession {
  public host?: WebSocket;
  public players: Set<WebSocket> = new Set();

  public onClose?: () => void;

  private isPrimaryServerForSession = false;
  private totalOpenConnections = 0;

  private lastHostMessage?: string;

  private hostChannel: BroadcastChannel;
  private playersChannel: BroadcastChannel;
  private connectionsChannel: BroadcastChannel;

  private readonly CLOSE_SIGNAL = "CLOSE";

  constructor(
    public adminCode: string,
    public joinCode: string,
    host?: WebSocket,
  ) {
    if (host) {
      this.isPrimaryServerForSession = true;
      this.addHost(host);
    }
    this.hostChannel = new BroadcastChannel(adminCode);
    this.hostChannel.onmessage = (event) => this.host?.send(event.data);
    this.playersChannel = new BroadcastChannel(joinCode);
    this.playersChannel.onmessage = (event) => {
      this.players.forEach((p) => p.send(event.data));
      this.lastHostMessage = event.data;
    }
    this.connectionsChannel = new BroadcastChannel(adminCode + joinCode);
    this.connectionsChannel.onmessage = ({ data }) => {
      if (data === this.CLOSE_SIGNAL) {
        this.closeSession();
      } else if (this.isPrimaryServerForSession) {
        this.changeOpenConnections(data);
      }
    };
  }

  public addHost(socket: WebSocket) {
    this.host = socket;
    this.changeOpenConnections(1);
    socket.onmessage = ({ data }) => {
      this.players.forEach((player) => player.send(data));
      this.playersChannel.postMessage(data);
      this.lastHostMessage = data;
    };
    socket.onclose = () => {
      this.host = undefined;
      this.changeOpenConnections(-1);
    };
  }

  public addPlayer(socket: WebSocket) {
    this.players.add(socket);
    this.changeOpenConnections(1);
    let name: string | undefined = undefined;
    socket.onopen = () =>
      this.lastHostMessage && socket.send(this.lastHostMessage);
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "JOIN") {
        name = data.name;
      }
      this.sendToHost(msg.data);
    };
    socket.onclose = () => {
      this.players.delete(socket);
      this.sendToHost(JSON.stringify({ type: "LEAVE", name }));
      this.changeOpenConnections(-1);
    };
  }

  private sendToHost(data: string) {
    this.host?.send(data);
    this.hostChannel.postMessage(data);
  }

  private closeSession() {
    this.hostChannel.close();
    this.playersChannel.close();
    this.connectionsChannel.close();
    this.onClose?.();
  }

  private changeOpenConnections(change: 1 | -1) {
    if (this.isPrimaryServerForSession) {
      this.totalOpenConnections = this.totalOpenConnections + change;
      if (this.totalOpenConnections === 0) {
        this.connectionsChannel.postMessage(this.CLOSE_SIGNAL);
        this.closeSession();
      }
    } else {
      this.connectionsChannel.postMessage(change);
    }
  }
}
