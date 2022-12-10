import type { SocketMessage } from '$lib/models/messages';
import websocketStore from '$lib/stores/websocket.store';

let socket: WebSocket;

export function connectSocket(params?: Map<string, string>) {
	let { host, protocol } = window.location;
	if (host.includes('localhost')) host = 'localhost:42069';
	const webSocketURL = new URL(`${protocol === 'https:' ? 'wss' : 'ws'}://${host}`);
	if (params) {
		params.forEach((val, key) => {
			webSocketURL.searchParams.append(key, val);
		})
	}
	return websocketStore<SocketMessage>(webSocketURL);
}

export const websocket = connectSocket();

const startSocketListeners = (socket: WebSocket) => {
	socket.onmessage = (event) => {
		console.log("Message from server:");
		console.log(event);
		console.log(JSON.parse(event.data));

		handle(JSON.parse(event.data));
	};

	socket.onclose = (event) => {
		console.log("Connection closed:");
		console.log(event);
	};

	socket.onerror = (event) => {
		console.log("Connection error:");
		console.log(event);
	};
};

interface ClientWebsocketMessages { }
export const sendMessage = (msg: ClientWebsocketMessages) => {
	socket?.send(JSON.stringify(msg));
};

interface ServerWebsocketMessages { }
export function handle(message: ServerWebsocketMessages) {
	// switch (message.type) {
	//   case "gamesession":
	// 	loadSession(message.sessionId, message.playerColor);
	// 	break;
	//   case "gamecontext":
	// 	updateGame(message);
	// 	navigateToGameIfNecessary();
	// 	break;
	//   case "menu":
	// 	navigateToMenu();
	// 	break;
	// }
}