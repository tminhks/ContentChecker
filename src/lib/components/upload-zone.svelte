<script lang="ts">
	import { clsx } from '$lib/clsx';

	let {
		onFileSelected,
		selectedFile = null,
		disabled = false,
		kind = 'video'
	}: {
		onFileSelected: (file: File) => void;
		selectedFile?: File | null;
		disabled?: boolean;
		kind?: 'video' | 'image';
	} = $props();

	let isDragging = $state(false);
	let inputEl: HTMLInputElement;

	const accept = $derived(kind === 'video' ? 'video/*' : 'image/*');
	const placeholderTitle = $derived(
		kind === 'video'
			? 'Kéo video vào đây hoặc nhấn để chọn file'
			: 'Kéo ảnh vào đây hoặc nhấn để chọn file'
	);
	const placeholderSub = $derived(
		kind === 'video'
			? 'Hỗ trợ MP4, MOV, WebM — tối đa 500MB'
			: 'Hỗ trợ JPG, PNG, WebP — tối đa 20MB'
	);
	const retypeHint = $derived(
		kind === 'video' ? 'nhấn để chọn video khác' : 'nhấn để chọn ảnh khác'
	);

	function openPicker() {
		if (!disabled) inputEl.click();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openPicker();
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (disabled) return;
		const file = e.dataTransfer?.files?.[0];
		if (file) onFileSelected(file);
	}

	function handleChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) onFileSelected(file);
		// Reset so selecting the same file again still fires a change event.
		input.value = '';
	}

	function formatSize(bytes: number) {
		const mb = bytes / (1024 * 1024);
		return `${mb.toFixed(1)} MB`;
	}
</script>

<div
	role="button"
	tabindex="0"
	aria-disabled={disabled}
	class={clsx(
		'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-8 py-14 text-center transition-all duration-200 ease-out',
		isDragging ? 'border-ink bg-surface-alt' : 'border-border bg-surface',
		disabled
			? 'cursor-not-allowed opacity-60'
			: 'cursor-pointer hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-sm'
	)}
	ondragover={(e) => {
		e.preventDefault();
		if (!disabled) isDragging = true;
	}}
	ondragleave={() => (isDragging = false)}
	ondrop={handleDrop}
	onclick={openPicker}
	onkeydown={handleKeydown}
>
	<span
		class="flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt text-ink-muted"
	>
		{#if kind === 'video'}
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M12 16V4M12 4l-4 4M12 4l4 4" />
				<path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
			</svg>
		{:else}
			<svg
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<rect x="3" y="3" width="18" height="18" rx="2" />
				<circle cx="8.5" cy="8.5" r="1.5" />
				<path d="M21 15l-5-5L5 21" />
			</svg>
		{/if}
	</span>

	{#if selectedFile}
		<p class="mt-4 text-sm font-medium text-ink">{selectedFile.name}</p>
		<p class="mt-1 text-xs text-ink-faint">{formatSize(selectedFile.size)} — {retypeHint}</p>
	{:else}
		<p class="mt-4 text-sm font-medium text-ink">{placeholderTitle}</p>
		<p class="mt-1 text-xs text-ink-faint">{placeholderSub}</p>
	{/if}

	<input
		bind:this={inputEl}
		type="file"
		{accept}
		{disabled}
		class="sr-only"
		onchange={handleChange}
	/>
</div>
