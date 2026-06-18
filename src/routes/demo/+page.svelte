<script lang="ts">
	import { setupPageTransition } from '$lib/page-transition';
	import ChatFab from '$lib/components/chat-fab.svelte';

	setupPageTransition();
</script>

<svelte:head>
	<title>Content Checker — Chọn loại nội dung</title>
</svelte:head>

<ChatFab />

<main class="flex min-h-screen flex-col items-center px-6 py-20">
	<div class="w-full max-w-2xl">
		<div
			class="relative text-center"
			style="background-image: radial-gradient(circle, var(--color-border) 1px, transparent 1px); background-size: 22px 22px;"
		>
			<a
				href="/"
				class="relative inline-flex h-[60px] w-[60px] items-center justify-center rounded-full bg-ink text-bg"
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
			<h1 class="relative mt-4 text-2xl font-bold text-ink">Chọn loại nội dung cần kiểm tra</h1>
			<p class="relative mt-2 text-sm text-ink-muted">
				Mỗi loại nội dung được phân tích theo một quy trình riêng.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2">
			<a
				href="/demo/video"
				class="group rounded-2xl border border-border border-t-4 border-t-safe bg-surface p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
			>
				<span
					class="flex h-11 w-11 items-center justify-center rounded-full bg-surface-alt text-ink-muted"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M23 7l-7 5 7 5V7z" />
						<rect x="1" y="5" width="15" height="14" rx="2" />
					</svg>
				</span>
				<h2 class="mt-4 text-lg font-semibold text-ink">Phân tích video</h2>
				<p class="mt-1.5 text-sm text-ink-muted">
					Dành cho Reels, TikTok — phân tích hình ảnh, âm thanh và transcript lời nói.
				</p>
				<span
					class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-transform group-hover:translate-x-1"
				>
					Bắt đầu
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</span>
			</a>

			<a
				href="/demo/image"
				class="group rounded-2xl border border-border border-t-4 border-t-safe bg-surface p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
			>
				<span
					class="flex h-11 w-11 items-center justify-center rounded-full bg-surface-alt text-ink-muted"
				>
					<svg
						width="20"
						height="20"
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
				</span>
				<h2 class="mt-4 text-lg font-semibold text-ink">Phân tích ảnh</h2>
				<p class="mt-1.5 text-sm text-ink-muted">
					Dành cho bài đăng ảnh kèm caption — phân tích hình ảnh và nội dung chữ.
				</p>
				<span
					class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-transform group-hover:translate-x-1"
				>
					Bắt đầu
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M5 12h14M13 6l6 6-6 6" />
					</svg>
				</span>
			</a>
		</div>
	</div>

	<p class="mt-16 max-w-md text-center text-xs text-ink-faint">
		Kết quả AI chỉ mang tính tham khảo, không thay thế tư vấn pháp lý.
	</p>
</main>
