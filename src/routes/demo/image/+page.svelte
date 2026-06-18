<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import UploadZone from '$lib/components/upload-zone.svelte';
	import Typewriter from '$lib/components/typewriter.svelte';
	import { clsx } from '$lib/clsx';
	import { AN_TOAN_IMAGE_RESULT } from '$lib/mock-results';
	import { setupPageTransition } from '$lib/page-transition';
	import ChatFab from '$lib/components/chat-fab.svelte';

	setupPageTransition();

	type Phase = 'upload' | 'processing';
	type BlockStatus = 'idle' | 'loading' | 'typing' | 'done';

	const ANALYZING_STEPS = ['Đang phân tích hình ảnh...', 'Đang tổng hợp kết luận...'];

	let phase = $state<Phase>('upload');
	let selectedFile = $state<File | null>(null);
	let caption = $state('');

	let captionStatus = $state<BlockStatus>('idle');

	let analyzingVisible = $state(false);
	let analyzingStepIndex = $state(0);
	let analyzingDone = $state(false);

	let resultVisible = $state(false);
	let revealedCount = $state(0);

	const resultLines = [
		{
			text: `${AN_TOAN_IMAGE_RESULT.badge} — ${AN_TOAN_IMAGE_RESULT.summary}`,
			kind: 'summary' as const
		},
		...AN_TOAN_IMAGE_RESULT.findings.map((f) => ({
			text: `${f.label}: ${f.detail}`,
			kind: 'finding' as const
		}))
	];

	const isComplete = $derived(revealedCount >= resultLines.length);
	const captionText = $derived(caption.trim() || '(Không có caption được nhập)');

	function handleFileSelected(file: File) {
		selectedFile = file;
	}

	function sleep(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	let resolveCaptionTyping: (() => void) | null = null;

	function handleCaptionTypingDone() {
		captionStatus = 'done';
		resolveCaptionTyping?.();
		resolveCaptionTyping = null;
	}

	async function handleAnalyze() {
		if (!selectedFile) return;
		phase = 'processing';

		captionStatus = 'loading';
		await sleep(2000);
		captionStatus = 'typing';
		await new Promise<void>((resolve) => {
			resolveCaptionTyping = resolve;
		});

		// Pop up the "analyzing" block below the row — the row stays on screen.
		analyzingVisible = true;
		analyzingStepIndex = 0;
		await sleep(1800);
		analyzingStepIndex = 1;
		await sleep(1000);
		analyzingDone = true;
		await sleep(400);

		// Pop up the "kết luận" block below that — everything above stays on screen.
		revealedCount = 0;
		resultVisible = true;
	}

	function handleRetry() {
		phase = 'upload';
		selectedFile = null;
		caption = '';
		captionStatus = 'idle';
		analyzingVisible = false;
		analyzingDone = false;
		resultVisible = false;
		revealedCount = 0;
	}
</script>

<svelte:head>
	<title>Content Checker — Phân tích ảnh</title>
</svelte:head>

<ChatFab />

<main class="flex min-h-screen flex-col items-center px-6 py-20">
	<div class="w-full max-w-3xl">
		<div class="text-center">
			<a
				href="/"
				class="inline-flex h-[60px] w-[60px] items-center justify-center rounded-full bg-ink text-bg"
			>
				<svg
					width="27"
					height="27"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M10 9 8 12l2 3M14 9l2 3-2 3" />
					<rect x="3" y="3" width="18" height="18" rx="3" />
				</svg>
			</a>
			<h1 class="mt-4 text-2xl font-bold text-ink">Phân tích ảnh</h1>
			<p class="mt-2 text-sm text-ink-muted">
				Tải ảnh và caption để phân tích bản quyền và rủi ro pháp lý.
			</p>
		</div>

		<div class="mt-10">
			{#if phase === 'upload'}
				<div transition:fade={{ duration: 220 }} class="mx-auto max-w-xl space-y-4">
					<UploadZone onFileSelected={handleFileSelected} {selectedFile} kind="image" />

					<div>
						<label for="caption" class="mb-1.5 block text-sm font-medium text-ink"
							>Caption bài đăng</label
						>
						<textarea
							id="caption"
							bind:value={caption}
							rows="3"
							placeholder="Nhập caption sẽ đăng kèm ảnh…"
							class="w-full rounded-2xl border border-border bg-surface p-4 text-sm text-ink outline-none transition-colors focus:border-ink-faint"
						></textarea>
					</div>

					<button
						type="button"
						disabled={!selectedFile}
						onclick={handleAnalyze}
						class={clsx(
							'w-full rounded-full px-6 py-3 text-sm font-semibold transition-colors',
							selectedFile
								? 'bg-ink text-bg hover:opacity-80'
								: 'cursor-not-allowed bg-surface-alt text-ink-faint'
						)}
					>
						Phân tích
					</button>
				</div>
			{:else}
				<!-- Row of blocks — stays on screen for the rest of the flow, never replaced. -->
				<div
					transition:fade={{ duration: 220 }}
					class="flex flex-col gap-4 sm:flex-row sm:items-stretch"
				>
					<div class="min-w-0 flex-1">
						<UploadZone onFileSelected={handleFileSelected} {selectedFile} kind="image" disabled />
					</div>

					<div
						in:fly={{ x: 24, duration: 320 }}
						class="flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-surface p-5 sm:max-w-xs"
					>
						{#if captionStatus === 'loading'}
							<div class="flex flex-1 flex-col items-center justify-center gap-3 text-center">
								<svg
									width="22"
									height="22"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-ink-faint"
									aria-hidden="true"
								>
									<path
										d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
									/>
								</svg>
								<p class="text-xs font-medium text-ink-muted">Đang phân tích caption...</p>
							</div>
						{:else}
							<p class="text-xs font-semibold tracking-wide uppercase text-ink-faint">Caption</p>
							<div
								class="mt-2 max-h-32 overflow-y-auto font-mono text-xs leading-relaxed text-ink-muted"
							>
								{#if captionStatus === 'typing'}
									<Typewriter text={captionText} onDone={handleCaptionTypingDone} />
								{:else}
									{captionText}
								{/if}
							</div>
						{/if}
					</div>
				</div>

				<!-- Pops up below the row once the caption block finishes; row stays mounted. -->
				{#if analyzingVisible}
					<div
						in:fly={{ y: 16, duration: 320 }}
						class="mx-auto mt-4 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-8 py-10 text-center"
						aria-live="polite"
					>
						{#if !analyzingDone}
							<span class="flex gap-1.5" aria-hidden="true">
								<span
									class="h-2 w-2 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.3s]"
								></span>
								<span
									class="h-2 w-2 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.15s]"
								></span>
								<span class="h-2 w-2 animate-bounce rounded-full bg-ink-faint"></span>
							</span>
							<p class="text-sm font-medium text-ink-muted">
								{ANALYZING_STEPS[analyzingStepIndex]}
							</p>
						{:else}
							<span
								class="flex h-7 w-7 items-center justify-center rounded-full bg-safe-bg text-safe"
								aria-hidden="true"
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.4"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path d="M5 13l4 4L19 7" />
								</svg>
							</span>
							<p class="text-sm font-medium text-ink">Đã phân tích xong</p>
						{/if}
					</div>
				{/if}

				<!-- Pops up below the analyzing block; everything above stays mounted. -->
				{#if resultVisible}
					<div in:fly={{ y: 16, duration: 320 }} class="mx-auto mt-4 max-w-xl">
						<div class="rounded-2xl border border-safe-border bg-safe-bg p-6">
							<div class="flex items-start gap-4">
								<span
									class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-surface text-safe"
								>
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2.2"
										stroke-linecap="round"
										stroke-linejoin="round"
										aria-hidden="true"
									>
										<path d="M5 13l4 4L19 7" />
									</svg>
								</span>
								<div class="min-h-[4.5rem] flex-1">
									{#each resultLines.slice(0, revealedCount) as line, i (i)}
										<p
											class={i === 0
												? 'text-base font-semibold text-ink'
												: 'mt-2 text-sm text-ink-muted'}
										>
											{line.text}
										</p>
									{/each}

									{#if !isComplete}
										{#key revealedCount}
											<p
												class={revealedCount === 0
													? 'text-base font-semibold text-ink'
													: 'mt-2 text-sm text-ink-muted'}
											>
												<Typewriter
													text={resultLines[revealedCount].text}
													startDelay={revealedCount === 0 ? 200 : 150}
													onDone={() => (revealedCount += 1)}
												/>
											</p>
										{/key}
									{/if}
								</div>
							</div>
						</div>

						{#if isComplete}
							<div transition:fade={{ duration: 220 }}>
								<button
									type="button"
									onclick={handleRetry}
									class="mt-4 w-full rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
								>
									Thử lại với ảnh khác
								</button>
							</div>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	</div>

	<p class="mt-16 max-w-md text-center text-xs text-ink-faint">
		Kết quả AI chỉ mang tính tham khảo, không thay thế tư vấn pháp lý.
	</p>
</main>
