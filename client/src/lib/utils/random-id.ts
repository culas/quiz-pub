export function randomId(length: number): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	return new Array(length)
		.fill(0)
		.map(() => characters[Math.floor(Math.random() * characters.length)])
		.join('');
}