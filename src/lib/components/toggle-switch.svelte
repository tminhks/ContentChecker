<script lang="ts">
	import { clsx } from '$lib/clsx';

	let {
		checked = false,
		label,
		description,
		onToggle
	}: {
		checked?: boolean;
		label: string;
		description?: string;
		onToggle?: (next: boolean) => void;
	} = $props();
</script>

<div class="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4">
	<div>
		<p class="text-sm font-semibold text-ink">{label}</p>
		{#if description}
			<p class="mt-0.5 text-xs text-ink-muted">{description}</p>
		{/if}
	</div>
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		aria-label={label}
		onclick={() => onToggle?.(!checked)}
		class={clsx(
			'relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-200',
			checked ? 'bg-safe' : 'bg-border'
		)}
	>
		<span
			class={clsx(
				'absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
				checked && 'translate-x-5'
			)}
		></span>
	</button>
</div>
