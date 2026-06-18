<script lang="ts">
	let {
		text,
		speedMs = 26,
		startDelay = 0,
		onDone
	}: {
		text: string;
		speedMs?: number;
		startDelay?: number;
		onDone?: () => void;
	} = $props();

	let visibleChars = $state(0);

	$effect(() => {
		visibleChars = 0;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			visibleChars = text.length;
			onDone?.();
			return;
		}

		let stepId: ReturnType<typeof setTimeout>;

		const startId = setTimeout(() => {
			const step = () => {
				visibleChars += 1;
				if (visibleChars < text.length) {
					stepId = setTimeout(step, speedMs);
				} else {
					onDone?.();
				}
			};
			step();
		}, startDelay);

		return () => {
			clearTimeout(startId);
			clearTimeout(stepId);
		};
	});

	const isTyping = $derived(visibleChars < text.length);
</script>

<span>{text.slice(0, visibleChars)}<span class="typewriter-cursor" class:is-typing={isTyping}></span></span>

<style>
	.typewriter-cursor {
		display: inline-block;
		width: 2px;
		height: 1em;
		margin-left: 1px;
		vertical-align: -0.15em;
		background: currentColor;
		opacity: 0;
	}

	.typewriter-cursor.is-typing {
		animation: blink 0.9s steps(2, jump-none) infinite;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		50.01%,
		100% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.typewriter-cursor {
			display: none;
		}
	}
</style>
