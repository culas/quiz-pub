export const copy = (element: HTMLElement, text?: string) => {
	let textToCopy = text;
	function handle() {
		textToCopy = textToCopy ?? element.innerText;
		try {
			window.navigator.clipboard.writeText(textToCopy);
			element.dispatchEvent(new CustomEvent('copy', { detail: textToCopy }));
		} catch (e) {
			element.dispatchEvent(new CustomEvent('copy:error', { detail: e }));
		}
	}

	element.addEventListener('click', handle, true);

	return {
		update: (text?: string) => {
			textToCopy = text;
		},
		destroy: () => {
			element.removeEventListener('click', handle, true);
		},
	};
};