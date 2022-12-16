import websocketStore from '$lib/stores/websocket.store';

export function connectSocket<T>(params?: Map<string, string>) {
	let { host, protocol } = window.location;
	if (host.includes('localhost')) host = 'localhost:42069';
	const webSocketURL = new URL(`${protocol === 'https:' ? 'wss' : 'ws'}://${host}`);
	if (params) {
		params.forEach((val, key) => {
			webSocketURL.searchParams.append(key, val);
		});
	}
	return websocketStore<T>(webSocketURL);
}

export const websocket = connectSocket();
