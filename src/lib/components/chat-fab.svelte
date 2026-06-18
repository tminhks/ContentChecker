<script lang="ts">
	// Decorative floating chat button — visual placeholder only, no panel/logic.
	// Mirrors the chatbot button styling already shipped on Web 2 for visual parity.
</script>

<button
	type="button"
	aria-label="Chat hỗ trợ"
	class="fixed right-4 bottom-4 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-safe text-white shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg sm:right-6 sm:bottom-6"
>
	<svg
		width="22"
		height="22"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path
			d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
		/>
		<circle cx="8" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
		<circle cx="12" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
		<circle cx="16" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
	</svg>
</button>
