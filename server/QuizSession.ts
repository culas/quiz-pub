import { HostMessage, QuizInfo, SocketMessage } from '../client/src/lib/models/messages.ts';

interface Player {
	session: WebSocket;
	name?: string;
	color: string;
}

export class QuizSession {
	public players: Player[] = [];
	public name = '';
	public questions = 0;
	public rounds = 0;

	constructor(
		public adminCode: string,
		public joinCode: string,
		public host: WebSocket,
	) {
		this.addHost(host);
	}

	public addHost(socket: WebSocket) {
		this.host = socket;
		socket.onmessage = msg => {
			const data = this.parse<HostMessage>(msg);
			if (data.type === 'quiz-info') {
				this.name = data.name;
				this.rounds = data.rounds;
				this.questions = data.questions;
			}
			this.players.forEach(player => player.session.send(msg.data));
		}
	}

	public addPlayer(socket: WebSocket) {
		const player = { session: socket, color: this.getPlayerColor() } as Player;
		this.players.push(player);
		socket.onmessage = msg => {
			const data = this.parse(msg);
			if (data.type === 'join-quiz') {
				player.name = data.name;
				this.broadcastPlayers();
				socket.send(JSON.stringify(this.getQuizInfo()));
			} else if (data.type === 'answers') {
				this.host.send(msg.data);
			}
		}
		socket.onclose = () => {
			this.players = this.players.filter(p => p.name !== player.name);
			this.broadcastPlayers();
		}
	}

	private broadcastPlayers() {
		this.broadcast({ type: 'players', players: this.players.map(({ name, color }) => ({ name: name ?? 'noname', color })) });
	}

	private broadcast(msg: SocketMessage) {
		const message = JSON.stringify(msg);
		this.host.send(message);
		this.players.forEach(p => p.session.send(message));
	}

	private getPlayerColor(): string {
		const colors = ['#066163', '#2666CF', '#4E9F3D'];
		console.log(this.players, colors, this.players.length % colors.length);
		return colors[this.players.length % colors.length];
	}

	private getQuizInfo(): QuizInfo {
		return {
			type: 'quiz-info',
			name: this.name,
			rounds: this.rounds,
			questions: this.questions,
			players: this.players.map(p => ({ name: p.name ?? '', color: p.color }))
		}
	}

	private parse<T extends SocketMessage>(msg: MessageEvent<string>): T {
		return JSON.parse(msg.data);
	}
}