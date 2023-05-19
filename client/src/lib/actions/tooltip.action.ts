import Tooltip from '$lib/components/Tooltip.svelte';

export const tooltip = (element: HTMLElement) => {
	let tooltipText: string | null;
	let tooltipComponent: Tooltip | undefined;

	const addTooltip = () => {
		tooltipText = element.getAttribute('data-tooltip');

		tooltipComponent = new Tooltip({
			target: document.body,
			props: {
				tooltipText,
				xAxis: 0,
				yAxis: 0
			}
		});

		const tooltipDiv = document.querySelector<HTMLElement>('#tooltip');
		const parentCoords = element.getBoundingClientRect();

		if (tooltipDiv) {
			const top = parentCoords.top + window.scrollY - tooltipDiv.offsetHeight - 10;
			const center = parentCoords.left + window.scrollX + (element.offsetWidth - tooltipDiv.offsetWidth) / 2;

			tooltipComponent?.$set({
				xAxis: center,
				yAxis: top
			});
		}
	};

	const removeTooltip = () => {
		tooltipComponent?.$destroy();
	};

	element.addEventListener('mouseover', addTooltip);
	element.addEventListener('mouseout', removeTooltip);

	return {
		destroy() {
			removeTooltip();
			element.removeEventListener('mouseover', addTooltip);
			element.removeEventListener('mouseout', removeTooltip);
		}
	};
};
