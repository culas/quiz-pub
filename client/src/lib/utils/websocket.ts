import websocketStore from '$lib/stores/websocket.store';
import type { StateEvent } from '$server-interface/events.model';
import type { SocketMessage } from '$server-interface/messages';

export function connectSocket(params?: Map<string, string>) {
	let { host, protocol } = window.location;
	if (host.includes('localhost')) host = 'localhost:42069';
	const webSocketURL = new URL(`${protocol === 'https:' ? 'wss' : 'ws'}://${host}`);
	if (params) {
		params.forEach((val, key) => {
			webSocketURL.searchParams.append(key, val);
		})
	}
	return websocketStore<SocketMessage | StateEvent>(webSocketURL);
}

export const websocket = connectSocket();
