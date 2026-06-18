import { onNavigate } from '$app/navigation';

/**
 * Soft cross-page transition using the browser's native View Transitions API.
 * No animation library, no root layout edit — call this from each +page.svelte.
 * Falls back to an instant navigation in browsers without support (e.g. Firefox).
 */
export function setupPageTransition() {
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
}
