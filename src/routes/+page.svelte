<script lang="ts">
	import { reveal } from '$lib/reveal';
	import { setupPageTransition } from '$lib/page-transition';
	import ChatFab from '$lib/components/chat-fab.svelte';

	setupPageTransition();
</script>

<svelte:head>
	<title>Content Checker</title>
</svelte:head>

<ChatFab />

<header class="border-b border-border">
	<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
		<span class="flex items-center gap-2.5 text-sm font-bold text-ink">
			<span class="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-ink text-bg">
				<svg
					width="21"
					height="21"
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
			</span>
			Content Checker
		</span>
		<a
			href="/demo"
			class="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-80"
		>
			Đăng ký tài khoản
		</a>
	</div>
</header>

<main>
	<!-- ════════════════════════════════════════════════════
	     HERO — left-aligned text, preview card on the right
	     ════════════════════════════════════════════════════ -->
	<section
		class="relative overflow-hidden px-6 py-24"
		style="background-image: radial-gradient(circle, var(--color-border) 1px, transparent 1px); background-size: 22px 22px;"
	>
		<div class="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
			<!-- Left: copy -->
			<div class="relative text-left" use:reveal>
				<div
					class="inline-flex items-center gap-2 rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-ink-muted"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-safe"></span>
					Kiểm duyệt nội dung bằng AI
				</div>

				<h1 class="mt-5 text-4xl font-bold leading-[1.12] text-ink sm:text-[2.75rem]">
					Kiểm tra video trước khi đăng
				</h1>

				<p class="mt-4 max-w-md text-base text-ink-muted">
					Phát hiện vi phạm bản quyền và rủi ro pháp lý theo Nghị định 72, Luật An ninh mạng — trước
					khi video của bạn lên sóng.
				</p>

				<a
					href="/demo"
					class="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-bg shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md"
				>
					Bắt đầu kiểm tra
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
				</a>
			</div>

			<!-- Right: result preview card — the visual anchor -->
			<div class="relative mt-4 lg:mt-0" use:reveal={{ delay: 120 }}>
				<div
					class="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-safe-bg opacity-70 blur-3xl"
					aria-hidden="true"
				></div>

				<div
					class="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg transition-all duration-300 ease-out hover:-translate-y-1"
				>
					<div class="flex items-center gap-2 border-b border-border bg-surface-alt px-4 py-3">
						<span class="h-2.5 w-2.5 rounded-full bg-border"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-border"></span>
						<span class="h-2.5 w-2.5 rounded-full bg-border"></span>
						<span class="ml-2 text-xs font-medium text-ink-faint">Kết quả phân tích</span>
					</div>

					<div class="p-6">
						<div class="flex items-start gap-4">
							<span
								class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-safe-bg text-safe"
							>
								<svg
									width="20"
									height="20"
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
							<div>
								<p class="text-xs font-semibold uppercase tracking-wide text-safe">An toàn</p>
								<p class="mt-1 text-base font-medium text-ink">
									Không phát hiện vi phạm bản quyền hoặc nội dung nhạy cảm.
								</p>
							</div>
						</div>

						<ul class="mt-5 space-y-2.5 border-t border-border pt-4">
							<li class="flex items-center gap-2.5 text-sm text-ink-muted">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="flex-shrink-0 text-safe"
									aria-hidden="true"
								>
									<path d="M5 13l4 4L19 7" />
								</svg>
								Bản quyền âm thanh — không trùng khớp
							</li>
							<li class="flex items-center gap-2.5 text-sm text-ink-muted">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="flex-shrink-0 text-safe"
									aria-hidden="true"
								>
									<path d="M5 13l4 4L19 7" />
								</svg>
								Bản quyền hình ảnh — không trùng khớp
							</li>
							<li class="flex items-center gap-2.5 text-sm text-ink-muted">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2.4"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="flex-shrink-0 text-safe"
									aria-hidden="true"
								>
									<path d="M5 13l4 4L19 7" />
								</svg>
								Nghị định 72 — không vi phạm
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════
	     CÁCH HOẠT ĐỘNG — diagonal hatch texture, asymmetric cards
	     ════════════════════════════════════════════════════ -->
	<section
		class="border-t border-border bg-surface-alt px-6 py-20"
		style="background-image: repeating-linear-gradient(135deg, var(--color-border) 0px, var(--color-border) 1px, transparent 1px, transparent 14px);"
	>
		<div class="mx-auto max-w-3xl">
			<div use:reveal>
				<span class="text-sm font-semibold uppercase tracking-wide text-ink-faint"
					>Cách hoạt động</span
				>
				<p class="mt-2 max-w-md text-sm text-ink-muted">
					Hai kênh phân tích độc lập, chạy song song trên cùng một video.
				</p>
			</div>

			<div class="mt-8 grid items-start gap-4 sm:grid-cols-2">
				<div
					use:reveal
					class="rounded-2xl border border-border border-t-4 border-t-safe bg-surface p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
				>
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full"
						style="background-color: #eaf1fb; color: #2d5fa3;"
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
							<path d="M3 8h18M5 8l1.5-3.5h3L8 8M11.5 8 13 4.5h3L14.5 8M18 8l1.5-3.5h2L20 8" />
							<rect x="3" y="8" width="18" height="12" rx="1.5" />
						</svg>
					</span>
					<h3 class="mt-4 text-base font-semibold text-ink">Kênh hình ảnh</h3>
					<p class="mt-1.5 text-sm text-ink-muted">
						Quét từng khung hình để phát hiện logo, hình ảnh có bản quyền hoặc nội dung nhạy cảm
						xuất hiện trong video.
					</p>
				</div>

				<div
					use:reveal={{ delay: 100 }}
					class="rounded-2xl border border-border border-t-4 border-t-safe bg-surface p-6 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-md sm:mt-6"
				>
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full"
						style="background-color: #e6f5f2; color: #287567;"
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
							<path d="M3 12v0M6 9v6M9 5v14M12 3v18M15 5v14M18 9v6M21 12v0" />
						</svg>
					</span>
					<h3 class="mt-4 text-base font-semibold text-ink">Kênh âm thanh &amp; phát ngôn</h3>
					<p class="mt-1.5 text-sm text-ink-muted">
						Chuyển lời nói thành văn bản và đối chiếu với nhạc nền để phát hiện trùng khớp bản quyền
						hoặc phát ngôn vi phạm pháp luật. Hỗ trợ tùy chọn tạo transcript bằng AI ngay trong quá
						trình phân tích.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- ════════════════════════════════════════════════════
	     VÌ SAO CHỌN — lưới 3×2 (bố cục lấy cảm hứng từ Y2mate,
	     màu sắc theo design system riêng của Content Checker)
	     ════════════════════════════════════════════════════ -->
	<section class="border-t border-border bg-bg px-6 py-20">
		<div class="mx-auto max-w-5xl">
			<span use:reveal class="text-sm font-semibold uppercase tracking-wide text-ink-faint">
				Vì sao chọn Content Checker
			</span>

			<div class="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
				<div use:reveal={{ delay: 0 }}>
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full border border-safe-border bg-surface-alt text-ink-muted"
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
							<circle cx="12" cy="12" r="9" />
							<path d="M12 7v5l3 3" />
						</svg>
					</span>
					<h3 class="mt-4 text-base font-semibold text-ink">Phân tích trong vài giây</h3>
					<p class="mt-1.5 text-sm text-ink-muted">
						Không cần đợi 15–20 phút xem lại video thủ công. Tải lên, nhận kết quả ngay.
					</p>
				</div>

				<div use:reveal={{ delay: 80 }}>
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full border border-safe-border bg-surface-alt text-ink-muted"
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
							<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
							<path d="M9 12l2 2 4-4" />
						</svg>
					</span>
					<h3 class="mt-4 text-base font-semibold text-ink">Đối chiếu đúng luật Việt Nam</h3>
					<p class="mt-1.5 text-sm text-ink-muted">
						Kiểm tra theo Nghị định 72 và Luật An ninh mạng — không phải quy định nước ngoài không
						áp dụng được.
					</p>
				</div>

				<div use:reveal={{ delay: 160 }}>
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full border border-safe-border bg-surface-alt text-ink-muted"
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
							<path d="M12 3l8 4-8 4-8-4 8-4z" />
							<path d="M4 12l8 4 8-4" />
							<path d="M4 16l8 4 8-4" />
						</svg>
					</span>
					<h3 class="mt-4 text-base font-semibold text-ink">Quét cả hình ảnh và lời nói</h3>
					<p class="mt-1.5 text-sm text-ink-muted">
						Phân tích khung hình để tìm logo, nội dung nhạy cảm — đồng thời chuyển lời nói thành văn
						bản để soát phát ngôn vi phạm.
					</p>
				</div>

				<div use:reveal={{ delay: 0 }}>
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full border border-safe-border bg-surface-alt text-ink-muted"
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
							<path d="M9 18h6M10 21h4" />
							<path d="M12 3a6 6 0 0 0-3 11.2V16h6v-1.8A6 6 0 0 0 12 3z" />
						</svg>
					</span>
					<h3 class="mt-4 text-base font-semibold text-ink">Luôn kèm hướng xử lý</h3>
					<p class="mt-1.5 text-sm text-ink-muted">
						Không chỉ báo lỗi suông — mỗi cảnh báo đi kèm gợi ý cụ thể nên làm gì tiếp theo.
					</p>
				</div>

				<div use:reveal={{ delay: 80 }}>
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full border border-safe-border bg-surface-alt text-ink-muted"
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
							<rect x="5" y="11" width="14" height="9" rx="2" />
							<path d="M8 11V8a4 4 0 0 1 8 0v3" />
						</svg>
					</span>
					<h3 class="mt-4 text-base font-semibold text-ink">Video không bị lưu trữ</h3>
					<p class="mt-1.5 text-sm text-ink-muted">
						Video chỉ dùng để phân tích, không lưu lại sau khi có kết quả.
					</p>
				</div>

				<div use:reveal={{ delay: 160 }}>
					<span
						class="flex h-12 w-12 items-center justify-center rounded-full border border-safe-border bg-surface-alt text-ink-muted"
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
							<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
						</svg>
					</span>
					<h3 class="mt-4 text-base font-semibold text-ink">
						Không cần cài đặt, không cần đăng ký
					</h3>
					<p class="mt-1.5 text-sm text-ink-muted">
						Hoạt động ngay trên trình duyệt, dùng thử miễn phí trước khi cần tài khoản.
					</p>
				</div>
			</div>
		</div>
	</section>
</main>

<footer class="border-t border-border px-6 py-10 text-center">
	<p class="text-xs text-ink-faint">
		Kết quả AI chỉ mang tính tham khảo, không thay thế tư vấn pháp lý.
	</p>
</footer>
