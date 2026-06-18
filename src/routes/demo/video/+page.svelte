<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import UploadZone from '$lib/components/upload-zone.svelte';
	import ToggleSwitch from '$lib/components/toggle-switch.svelte';
	import Typewriter from '$lib/components/typewriter.svelte';
	import { clsx } from '$lib/clsx';
	import { AN_TOAN_RESULT, TRANSCRIPT_PLACEHOLDER } from '$lib/mock-results';
	import { setupPageTransition } from '$lib/page-transition';
	import ChatFab from '$lib/components/chat-fab.svelte';

	setupPageTransition();

	type Phase = 'upload' | 'processing';
	type BlockStatus = 'idle' | 'loading' | 'typing' | 'done';

	const ANALYZING_STEPS = ['Đang phân tích hình ảnh video...', 'Đang tổng hợp kết luận...'];

	let phase = $state<Phase>('upload');
	let selectedFile = $state<File | null>(null);
	let transcriptEnabled = $state(true);
	let audioEnabled = $state(true);

	let audioStatus = $state<BlockStatus>('idle');
	let transcriptStatus = $state<BlockStatus>('idle');

	let analyzingVisible = $state(false);
	let analyzingStepIndex = $state(0);
	let analyzingDone = $state(false);

	let resultVisible = $state(false);
	let revealedCount = $state(0);

	const resultLines = [
		{ text: `${AN_TOAN_RESULT.badge} — ${AN_TOAN_RESULT.summary}`, kind: 'summary' as const },
		...AN_TOAN_RESULT.findings.map((f) => ({
			text: `${f.label}: ${f.detail}`,
			kind: 'finding' as const
		}))
	];

	const isComplete = $derived(revealedCount >= resultLines.length);
	const audioFilename = $derived(
		selectedFile ? selectedFile.name.replace(/\.[^./]+$/, '.mp3') : ''
	);

	function handleFileSelected(file: File) {
		selectedFile = file;
	}

	function sleep(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	let resolveTranscriptTyping: (() => void) | null = null;

	function handleTranscriptTypingDone() {
		transcriptStatus = 'done';
		resolveTranscriptTyping?.();
		resolveTranscriptTyping = null;
	}

	async function handleAnalyze() {
		if (!selectedFile) return;
		phase = 'processing';

		if (audioEnabled || transcriptEnabled) {
			const tasks: Promise<void>[] = [];

			if (audioEnabled) {
				audioStatus = 'loading';
				tasks.push(
					sleep(2000).then(() => {
						audioStatus = 'done';
					})
				);
			}

			if (transcriptEnabled) {
				transcriptStatus = 'loading';
				tasks.push(
					sleep(2000).then(() => {
						transcriptStatus = 'typing';
						return new Promise<void>((resolve) => {
							resolveTranscriptTyping = resolve;
						});
					})
				);
			}

			await Promise.all(tasks);
		}

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
		audioStatus = 'idle';
		transcriptStatus = 'idle';
		analyzingVisible = false;
		analyzingDone = false;
		resultVisible = false;
		revealedCount = 0;
	}
</script>

<svelte:head>
	<title>Content Checker — Phân tích video</title>
</svelte:head>

<ChatFab />

<main class="relative flex min-h-screen flex-col items-center overflow-hidden px-6 py-20">
	<!-- Background depth: faint dot-grid + two very soft radial blurs (decorative only). -->
	<div
		class="pointer-events-none absolute inset-0 -z-10 opacity-40"
		style="background-image: radial-gradient(circle, var(--color-border) 1px, transparent 1px); background-size: 22px 22px;"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full bg-safe opacity-[0.06] blur-3xl"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute -right-32 -bottom-32 -z-10 h-96 w-96 rounded-full bg-safe opacity-[0.06] blur-3xl"
		aria-hidden="true"
	></div>

	<!-- Decorative side labels — desktop only, non-interactive, kept low-key. -->
	<div
		class="pointer-events-none absolute top-1/2 left-8 hidden -translate-y-1/2 flex-col items-center gap-20 xl:flex"
		aria-hidden="true"
	>
		<span
			class="text-[11px] font-medium tracking-[0.2em] text-ink-faint uppercase opacity-40"
			style="writing-mode: vertical-rl;"
		>
			Audio Extraction
		</span>
		<span
			class="text-[11px] font-medium tracking-[0.2em] text-ink-faint uppercase opacity-40"
			style="writing-mode: vertical-rl;"
		>
			Copyright Match
		</span>
		<span
			class="text-[11px] font-medium tracking-[0.2em] text-ink-faint uppercase opacity-40"
			style="writing-mode: vertical-rl;"
		>
			Legal Review
		</span>
	</div>
	<div
		class="pointer-events-none absolute top-1/2 right-8 hidden -translate-y-1/2 flex-col items-center gap-20 xl:flex"
		aria-hidden="true"
	>
		<span
			class="text-[11px] font-medium tracking-[0.2em] text-ink-faint uppercase opacity-40"
			style="writing-mode: vertical-rl;"
		>
			Transcript Analysis
		</span>
		<span
			class="text-[11px] font-medium tracking-[0.2em] text-ink-faint uppercase opacity-40"
			style="writing-mode: vertical-rl;"
		>
			Visual Scan
		</span>
		<span
			class="text-[11px] font-medium tracking-[0.2em] text-ink-faint uppercase opacity-40"
			style="writing-mode: vertical-rl;"
		>
			Risk Detection
		</span>
	</div>

	<div class="relative z-10 w-full max-w-3xl">
		<div class="text-center">
			<a
				href="/"
				class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-bg shadow-md ring-1 ring-black/5 transition-transform duration-200 ease-out hover:-translate-y-0.5"
			>
				<svg
					width="28"
					height="28"
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

			<div
				class="mt-5 inline-flex items-center gap-2 rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-ink-muted"
			>
				<span class="h-1.5 w-1.5 rounded-full bg-safe" aria-hidden="true"></span>
				Phân tích bằng AI
			</div>

			<h1 class="mt-3 text-[28px] font-bold tracking-tight text-ink">Phân tích video</h1>
			<p class="mt-2 text-[15px] text-ink-muted">
				Tải video lên để phân tích bản quyền và rủi ro pháp lý.
			</p>
		</div>

		<div class="mt-12">
			{#if phase === 'upload'}
				<div transition:fade={{ duration: 220 }} class="mx-auto max-w-xl space-y-4">
					<UploadZone onFileSelected={handleFileSelected} {selectedFile} kind="video" />

					<ToggleSwitch
						checked={audioEnabled}
						onToggle={(next) => (audioEnabled = next)}
						label="Trích xuất và phân tích audio"
						description="Tách và đối chiếu nhạc nền với cơ sở dữ liệu bản quyền."
					/>

					<ToggleSwitch
						checked={transcriptEnabled}
						onToggle={(next) => (transcriptEnabled = next)}
						label="Phân tích transcript bằng AI"
						description="Tự động tạo phụ đề và phân tích nội dung lời nói trong video."
					/>

					<button
						type="button"
						disabled={!selectedFile}
						onclick={handleAnalyze}
						class={clsx(
							'w-full rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out',
							selectedFile
								? 'bg-ink text-bg shadow-sm hover:-translate-y-0.5 hover:shadow-md'
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
					{#if audioEnabled}
						<div
							in:fly={{ x: -24, duration: 320 }}
							class="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border/80 bg-surface px-5 py-8 text-center shadow-sm sm:w-48 sm:flex-shrink-0"
						>
							{#if audioStatus === 'loading'}
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
									<path d="M3 12v0M6 9v6M9 5v14M12 3v18M15 5v14M18 9v6M21 12v0" />
								</svg>
								<p class="text-xs font-medium text-ink-muted">Đang trích xuất audio...</p>
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
									class="text-safe"
									aria-hidden="true"
								>
									<path d="M3 12v0M6 9v6M9 5v14M12 3v18M15 5v14M18 9v6M21 12v0" />
								</svg>
								<p class="line-clamp-2 text-xs font-medium break-all text-ink">{audioFilename}</p>
							{/if}
						</div>
					{/if}

					<div class="min-w-0 flex-1">
						<UploadZone onFileSelected={handleFileSelected} {selectedFile} kind="video" disabled />
					</div>

					{#if transcriptEnabled}
						<div
							in:fly={{ x: 24, duration: 320 }}
							class="flex min-w-0 flex-1 flex-col rounded-2xl border border-border/80 bg-surface p-5 shadow-sm sm:max-w-xs"
						>
							{#if transcriptStatus === 'loading'}
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
										<rect x="3" y="5" width="18" height="14" rx="2" />
										<path d="M7 10h4M7 14h7" />
									</svg>
									<p class="text-xs font-medium text-ink-muted">Đang dịch transcript...</p>
								</div>
							{:else}
								<p class="text-xs font-semibold tracking-wide uppercase text-ink-faint">
									Transcript
								</p>
								<div
									class="mt-2 max-h-32 overflow-y-auto font-mono text-xs leading-relaxed text-ink-muted"
								>
									{#if transcriptStatus === 'typing'}
										<Typewriter text={TRANSCRIPT_PLACEHOLDER} onDone={handleTranscriptTypingDone} />
									{:else}
										{TRANSCRIPT_PLACEHOLDER}
									{/if}
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- Pops up below the row once the blocks above finish; row stays mounted. -->
				{#if analyzingVisible}
					<div
						in:fly={{ y: 16, duration: 320 }}
						class="mx-auto mt-5 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-border/80 bg-surface px-8 py-10 text-center shadow-sm"
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

							<!-- AI status chips — neutral, low-key confirmation of each completed channel. -->
							<div
								transition:fade={{ duration: 220 }}
								class="mt-1 flex flex-wrap items-center justify-center gap-2"
							>
								{#if audioEnabled}
									<span
										class="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-medium text-ink-muted"
									>
										<svg
											width="11"
											height="11"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="text-safe"
											aria-hidden="true"
										>
											<path d="M5 13l4 4L19 7" />
										</svg>
										Audio Processed
									</span>
								{/if}
								{#if transcriptEnabled}
									<span
										class="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-medium text-ink-muted"
									>
										<svg
											width="11"
											height="11"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="3"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="text-safe"
											aria-hidden="true"
										>
											<path d="M5 13l4 4L19 7" />
										</svg>
										Transcript Generated
									</span>
								{/if}
								<span
									class="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-alt px-3 py-1 text-xs font-medium text-ink-muted"
								>
									<svg
										width="11"
										height="11"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
										class="text-safe"
										aria-hidden="true"
									>
										<path d="M5 13l4 4L19 7" />
									</svg>
									Visual Scan Complete
								</span>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Pops up below the analyzing block; everything above stays mounted. -->
				{#if resultVisible}
					<div in:fly={{ y: 16, duration: 320 }} class="mx-auto mt-7 max-w-xl">
						<!-- Horizontal process timeline — simple summary of the steps behind the conclusion below. -->
						<ol
							class="mb-5 flex items-start justify-between gap-1"
							aria-label="Các bước đã phân tích"
						>
							{#each [{ label: 'Audio', done: audioEnabled }, { label: 'Transcript', done: transcriptEnabled }, { label: 'Visual Analysis', done: true }, { label: 'Legal Review', done: true }] as step, i (step.label)}
								<li class="flex flex-1 flex-col items-center gap-1.5 text-center">
									<div class="flex w-full items-center">
										<span
											class={clsx(
												'h-px flex-1',
												i === 0 ? 'opacity-0' : step.done ? 'bg-safe-border' : 'bg-border'
											)}
											aria-hidden="true"
										></span>
										<span
											class={clsx(
												'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full',
												step.done ? 'bg-safe-bg text-safe' : 'bg-surface-alt text-ink-faint'
											)}
											aria-hidden="true"
										>
											{#if step.done}
												<svg
													width="11"
													height="11"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="3"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<path d="M5 13l4 4L19 7" />
												</svg>
											{:else}
												<svg
													width="9"
													height="9"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="3"
													stroke-linecap="round"
												>
													<path d="M5 12h14" />
												</svg>
											{/if}
										</span>
										<span
											class={clsx(
												'h-px flex-1',
												i === 3 ? 'opacity-0' : step.done ? 'bg-safe-border' : 'bg-border'
											)}
											aria-hidden="true"
										></span>
									</div>
									<span
										class={clsx(
											'text-[11px] font-medium',
											step.done ? 'text-ink-muted' : 'text-ink-faint'
										)}
									>
										{step.label}
									</span>
								</li>
							{/each}
						</ol>

						<div
							class="relative overflow-hidden rounded-3xl border border-safe-border bg-safe-bg p-8 shadow-lg ring-1 ring-black/[0.02]"
						>
							<span class="absolute inset-x-0 top-0 h-1.5 bg-safe" aria-hidden="true"></span>

							<div class="flex items-start gap-4">
								<span
									class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-surface text-safe shadow-sm"
								>
									<svg
										width="22"
										height="22"
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
										{#if i === 1}
											<div class="my-3.5 border-t border-safe-border/60" aria-hidden="true"></div>
										{/if}
										<p
											class={i === 0
												? 'text-xl leading-snug font-semibold tracking-tight text-ink'
												: 'mt-2.5 text-sm leading-relaxed text-ink-muted'}
										>
											{line.text}
										</p>
									{/each}

									{#if !isComplete}
										{#key revealedCount}
											{#if revealedCount === 1}
												<div class="my-3.5 border-t border-safe-border/60" aria-hidden="true"></div>
											{/if}
											<p
												class={revealedCount === 0
													? 'text-xl leading-snug font-semibold tracking-tight text-ink'
													: 'mt-2.5 text-sm leading-relaxed text-ink-muted'}
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
									class="mt-5 w-full rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink-muted transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-ink-faint hover:bg-surface-alt hover:text-ink hover:shadow-sm"
								>
									Thử lại với video khác
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
