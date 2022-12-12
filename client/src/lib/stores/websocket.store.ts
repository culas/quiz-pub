import type { Subscriber, Writable } from 'svelte/store';

const reopenTimeouts = [2000, 5000, 10000, 30000, 60000];

/**
 * Create a writable store based on a web-socket.
 * Data is transferred as JSON.
 * Keeps socket open (reopens if closed) as long as there are subscriptions.
 * @param {string} url the WebSocket url
 * @return {Store}
 * adapted from: https://github.com/arlac77/svelte-websocket-store
 */
export function websocketStore<T>(url: URL): Omit<Writable<T>, 'update'> {
	let socket: WebSocket | undefined;
	let openPromise: Promise<void> | undefined;
	let reopenTimeoutHandler: number | undefined;
	let reopenCount = 0;

	const subscriptions = new Set<Subscriber<T>>();

	function reopenTimeout() {
		const n = reopenCount;
		reopenCount++;
		return reopenTimeouts[
			n >= reopenTimeouts.length - 1 ? reopenTimeouts.length - 1 : n
		];
	}

	function close() {
		if (reopenTimeoutHandler) {
			clearTimeout(reopenTimeoutHandler);
		}

		if (socket) {
			socket.close();
			socket = undefined;
		}
	}

	function reopen() {
		close();
		if (subscriptions.size > 0) {
			reopenTimeoutHandler = window.setTimeout(() => open(), reopenTimeout());
		}
	}

	async function open() {
		if (reopenTimeoutHandler) {
			clearTimeout(reopenTimeoutHandler);
			reopenTimeoutHandler = undefined;
		}

		// we are still in the opening phase
		if (openPromise) {
			return openPromise;
		}

		socket = new WebSocket(url);

		socket.onmessage = event => {
			const val = JSON.parse(event.data);
			subscriptions.forEach(subscription => subscription(val));
		};

		// TODO: enable
		//socket.onclose = () => reopen();

		openPromise = new Promise((resolve, reject) => {
			if (!socket) {
				reject('socket closed');
				return;
			}
			socket.onerror = error => {
				reject(error);
				openPromise = undefined;
			};
			socket.onopen = () => {
				reopenCount = 0;
				resolve();
				openPromise = undefined;
			};
		});
		return openPromise;
	}

	return {
		set(value) {
			const send = () => socket?.send(JSON.stringify(value));
			if (socket?.readyState !== WebSocket.OPEN) open().then(send);
			else send();
		},
		subscribe(subscription) {
			open();
			subscriptions.add(subscription);
			return () => {
				subscriptions.delete(subscription);
				if (subscriptions.size === 0) {
					close();
				}
			};
		}
	};
}

export default websocketStore;