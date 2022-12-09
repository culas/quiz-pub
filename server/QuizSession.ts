export class QuizSession {
	public players: { name: string, color: string, session: WebSocket }[] = [];

	constructor(
		public adminCode: string,
		public joinCode: string,
		public name: string,
		public host: WebSocket,
	) {
		host.onmessage = msg => {
			this.players.forEach(player => player.session.send(msg.data));
		}
	}

	public addPlayer(player: WebSocket, name: string) {
		const p = { name, color: this.getColor() };
		this.players.push({ session: player, ...p });
		this.host.send(JSON.stringify(p));
		this.players.forEach(p => p.session.send(JSON.stringify(p)));

		player.onmessage = msg => {
			if (msg.data.type === 'answer') {
				this.host.send(msg.data);
			}
		}
	}

	private getColor(): string {
		const colors = ['#334400', '#885500', '#005599'];
		return colors[this.players.length % colors.length];
	}
}