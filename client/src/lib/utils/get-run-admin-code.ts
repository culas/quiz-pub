export function getRunAdminCode(id: string): string | undefined {
	return new Array(20)
		.fill(0)
		.map((_, i) => id + (i + 1))
		.find(id => !localStorage.getItem(id));
}
