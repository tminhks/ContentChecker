/** Svelte action: fades + slides an element in once when it enters the viewport. */
export function reveal(node: HTMLElement, params: { delay?: number } = {}) {
	node.classList.add('reveal');
	node.style.transitionDelay = `${params.delay ?? 0}ms`;

	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('reveal-visible');
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('reveal-visible');
					observer.unobserve(node);
				}
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
