# CLAUDE.md

You are an agent tasked with building a website for Content Checker— a web app that helps users check whether a video violates copyright or Vietnamese legal regulations (Nghị định 72 on internet/online information management, and the Law on Cybersecurity) before publishing it on social media. It is built using SvelteKit, Tailwind CSS, Drizzle, and Postgres.

---

## 0. Working Philosophy

These two loops are mandatory process for every session on this project. They apply on top of, not instead of, every rule below.

### 0.1 Working Loop (applies to EVERY task)

For any task assigned in this project:
1. **Understand the task** — restate the goal in one line before starting.
2. **Implement it.**
3. **Self-verify the result** — actually run it, inspect the output, or check it against the goal. Do not assume it works because the code looks right.
4. **If verification reveals a gap, refine it.**
5. **Verify again.** Repeat steps 3–5 until the result genuinely meets the goal.
6. **Only then report done** — and state *how* it was verified (command run, output observed, screenshot taken, etc.).

Completion = verified result, never "the code looks right." For this project specifically, "verify" means: run `pnpm dev` (or hit the relevant route), call `svelte-autofixer` on any Svelte code before considering it final, run `pnpm check` and `pnpm lint`, and where the change is visual, actually render the page and look at it (see §0.2). Re-reading the diff is not verification.

### 0.2 Web UI Loop (applies whenever building or editing a page/component's UI)

When the task involves visual/UI work — especially when a reference or inspiration image is provided:

1. **Open the reference image** (if provided) and write a short design extraction: palette hex values, typography, spacing, layout, component treatments, mood.
2. **Render the current page and capture a screenshot** at two default viewports: 1440px desktop and 390px mobile. Save to a `design-review/` folder at the project root with versioned names, e.g. `design-review/dashboard-desktop-v1.png` — so progress is tracked across iterations.
3. **Compare the screenshot against the reference (or against the existing design system) and list every concrete difference** — color values, font family/size/weight, spacing, alignment, proportions, component styling. Be specific with measured values, not "looks close."
4. **Fix the differences one at a time.**
5. **After each change, take a new screenshot and re-compare** (bump the version suffix), so progress is visible step by step.
6. **Repeat until the rendered page matches the reference/design intent as closely as technically possible.** Stop only when remaining gaps are negligible or impossible — and say which gaps remain and why.

Never claim a UI change "matches the design" without a fresh screenshot to back it.

**Screenshot tooling for this project:** No `chromium-cli` is available in this environment. Use Playwright instead — confirmed working via:
```bash
npx --yes playwright install chromium --with-deps   # one-time per environment
npm install --no-save playwright                     # local import for a driver script
node your-screenshot-script.mjs
```
Point it at the dev server started by `pnpm dev`. If Playwright cannot be installed (no network, sandboxed), say so immediately and ask the user for screenshots manually — do not silently skip the visual check.

---

Here are several guidelines you must always follow:

- Follow https://svelte.dev/llms.txt when writing Svelte code.
  - Do not update states using $effect. If a variable depends on states, use $derived instead.
- You must always use Svelte 5 syntax and Tailwind utility classes whenever possible.
- You must not modify src/routes/+layout.svelte (the root layout), 
- You must use kebab-case rather than camelCase or snake_case for file names.
- You must use camelCase for variables and SCREAMING_SNAKE_CASE for constants.
- Use Zod to validate inputs passed to remote functions. Instructions are provided at https://zod.dev/llms.txt.
  - Prefer z.strictObject over z.object when possible.
- Use form remote functions instead of form actions when adding a form. Look into https://svelte.dev/docs/kit/llms.txt to understand what a remote function is. Do not use onsubmit for form submissions. Client-side preflight schema and server-side remote function schema must be the same Zod schema. Export it from a shared file (e.g. ./schema.ts) as .remote.ts files cannot export Zod schemas.
- Use prerender remote functions to fetch data that only needs to be updated once per deployment.
- Use load functions rather than query remote functions to fetch dynamic data. Add Cache-Control header via setHeaders appropriately. Since the website is static by default, add export const prerender = false (or export const prerender = "auto" if page can be prerendered) to +page.server.ts to allow fetching dynamic data.
- If any class property is too long (i.e. over 100 characters), you must divide it into multiple lines using the clsx utility imported using import { clsx } from "$lib/clsx". Keep the lines balanced in length.
- You must write Drizzle code following instructions provided at https://orm.drizzle.team/llms.txt.
  - Table names and column names must use the camelCase convention in TypeScript and snake_case in Postgres.
  - Use the Postgres schema cncSchema when writing a Drizzle schema.


- When making a Git commit, follow the Conventional Commits specification for commit messages.
- Always run pnpm lint before committing. Fix all issues until pnpm lint no longer returns warnings or errors.

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

---

## Trạng thái hiện tại

*Ghi lúc: sau khi đồng bộ layout cộng-dồn từ `/demo/video` sang `/demo/image`. Toàn bộ mục này được viết sau khi đọc trực tiếp source code (4 route file, `mock-results.ts`) và grep xác nhận import, không suy đoán.*

### Cấu trúc hiện có (routes)

- **`/`** (`src/routes/+page.svelte`) — landing page. Header (logo 42px + nút "Đăng ký tài khoản" → `/demo`). Hero 2 cột: text trái (eyebrow, headline, body, CTA "Bắt đầu kiểm tra") + preview card phải (browser-chrome giả + kết quả AN TOÀN mẫu), nền dot-grid + halo mờ. Section "Cách hoạt động" (2 card kênh hình ảnh/âm thanh, nền hatch chéo, card 2 lệch xuống `sm:mt-6` có chủ đích). Section "Vì sao chọn Content Checker" (lưới 6 ô, `sm:grid-cols-2 lg:grid-cols-3` → 1 cột dưới `sm`). Footer disclaimer.
- **`/demo`** (`src/routes/demo/+page.svelte`) — hub chọn loại nội dung: 2 card link tới `/demo/video` và `/demo/image`.
- **`/demo/video`** (`src/routes/demo/video/+page.svelte`) — flow phân tích video. Upload + 2 toggle (audio, transcript) + nút "Phân tích". Sau khi bấm: layout **cộng dồn** (không khối nào bị remove) — hàng ngang [Âm thanh nếu audio toggle on] – [Import video, luôn có] – [Transcript nếu transcript toggle on] chạy xử lý đồng thời, rồi khối "đang phân tích / đã phân tích xong" pop-up thêm bên dưới (`fly y:16`), rồi khối kết luận pop-up thêm bên dưới nữa. Kết quả cố định `AN_TOAN_RESULT`.
- **`/demo/image`** (`src/routes/demo/image/+page.svelte`) — flow phân tích ảnh. Upload ảnh + textarea caption + nút "Phân tích". **Giờ đã cùng pattern layout cộng-dồn với `/demo/video`**, chỉ khác số khối: vì ảnh không có khái niệm "audio", hàng ngang chỉ có **2 khối cố định** [Import ảnh, luôn có, không toggle] – [Caption, loading "Đang phân tích caption..." rồi gõ chữ ra nội dung caption người dùng nhập]. Sau đó cùng pop-up "đang phân tích/đã phân tích xong" rồi kết luận, animation (`fade`/`fly`) giống y `/demo/video`. Kết quả cố định `AN_TOAN_IMAGE_RESULT`.

### Đã hoàn thành (verify chạy thật, không chỉ đọc code)

- Navigate thật giữa 4 route (`page.waitForURL`).
- Landing: hero 2 cột, lưới "Vì sao chọn" — verify bằng screenshot 1440px/390px **và** đo `getComputedStyle().gridTemplateColumns` thật (3 cột desktop, 1 cột mobile).
- `/demo/video`: cả 3 combo toggle (cả 2 bật / chỉ audio / chỉ transcript) cho đúng số khối + đúng thứ tự trái-phải — verify bằng đếm DOM children qua Playwright.
- Audio block đổi đúng đuôi file (`clip.mp4` → `clip.mp3`, giữ tên).
- Transcript block gõ ra đúng `TRANSCRIPT_PLACEHOLDER`, chỉ coi "done" sau khi gõ xong hẳn (dùng Promise resolver gắn vào `onDone` của Typewriter, không phải timeout cố định).
- Audio + transcript chạy **đồng thời** (`Promise.all`, đã verify bằng timing log thật).
- Layout cộng dồn (cả `/demo/video` và `/demo/image`): tại trạng thái cuối, hàng khối + khối "đã phân tích xong" + khối kết luận **cùng `isVisible() === true`** — đã verify cho cả 2 trang, không phải suy đoán từ ảnh.
- `/demo/image`: row có đúng **2 khối** (đo `row.children.length === 2`), khối Caption hiện loading rồi gõ chữ ra đúng nội dung caption đã nhập ("Caption test cho bài đăng ảnh" trong test), 2 bước "Đang phân tích hình ảnh.../Đang tổng hợp kết luận..." chạy đúng tuần tự, kết quả riêng (Hình ảnh/Caption/Nghị định 72) hiện đúng — verify bằng Playwright.
- Bug thật đã tìm và fix: input file không reset sau khi chọn → chọn lại cùng file không trigger `change` → fix bằng `input.value = ''` (áp dụng ở `upload-zone.svelte`, dùng chung cho cả 2 trang).
- Dọn dead code: `VIDEO_LOADING_STEPS` và `IMAGE_LOADING_STEPS` đã bị xóa khỏi `mock-results.ts` (cả 2 trang giờ tự định nghĩa `ANALYZING_STEPS` cục bộ trong component, đã grep xác nhận không còn import nào trỏ tới 2 hằng số cũ).

### Đã hoàn thành thêm (phiên gần nhất — xử lý 3 điểm treo)

- **`TopBar.svelte` đã bị xóa** khỏi `src/lib/components/` — user chốt không cần giữ, không dùng tới. Verify: `pnpm check`/`pnpm lint` sau khi xóa không có lỗi mới (lỗi/warning còn lại đều pre-existing, không liên quan TopBar).
- **Web 1 giữ cố định case "an_toàn"** — đã xác nhận đây là chủ đích (3 web độc lập, mỗi web đại diện đúng 1 case để quay video demo), không phải thiếu sót, không cần sửa.
- **Web 2** (`content-checker-rui-ro-cao/`) và **Web 3** (`content-checker-can-luu-y/`) đã được đồng bộ UI/layout/animation theo bản mới nhất của Web 1's `/demo/video`: layout 3-khối-cộng-dồn (Âm thanh/Import video/Transcript), 2 toggle mới ("Trích xuất và phân tích audio", "Phân tích transcript bằng AI", mặc định bật), fly-in animation từng khối, typewriter cho transcript + kết luận. Vì Web 2/3 là static HTML + vanilla JS (không phải SvelteKit) — đã **port sang vanilla JS/CSS**, giữ nguyên kiến trúc tĩnh cũ, không convert sang SvelteKit (quyết định rõ từ user).
  - **Nội dung kết quả giữ nguyên 100%, không đổi**: `RESULT_LINES` ở `content-checker-rui-ro-cao/app.js` (rủi ro cao — Sony Music + phát ngôn nhạy cảm) và `content-checker-can-luu-y/app.js` (cần lưu ý — logo thương hiệu).
  - Verify thật bằng Playwright cho cả 2 web: 3 khối row đúng thứ tự trái-phải, audio đổi đúng đuôi `.mp4`→`.mp3`, tắt toggle audio → row co đúng về 2 khối, kết quả gõ ra đúng nguyên văn `RESULT_LINES` cũ, retry reset đúng về trạng thái ban đầu. Screenshot desktop 1440px + mobile 390px lưu tại `design-review/` của từng project.
  - Bug thật đã tìm và fix: `flyIn()` (hàm animation pop-up dùng chung) ban đầu luôn set `display:flex` cho mọi khối — khiến khối kết luận + nút "Thử lại" bị xếp ngang cạnh nhau thay vì xếp dọc đúng layout Web 1. Fix bằng cách thêm tham số `display` cho `flyIn()`, gọi `'block'` riêng cho khối kết luận.

### Đã hoàn thành thêm (phiên gần nhất — transcript thật + visual polish Web 1)

- **Transcript Web 1 đã thay placeholder bằng transcript thật** (`src/lib/mock-results.ts` — `TRANSCRIPT_PLACEHOLDER`): video review app "ưu đãi" với 3 vấn đề lồng trong lời nói (chia sẻ danh bạ tích sẵn, thông tin quảng bá chưa kiểm chứng...). Vẫn dùng tên biến `TRANSCRIPT_PLACEHOLDER` (không đổi tên) vì vẫn là mock cố định, chỉ đổi nội dung từ joke sang transcript thật. `AN_TOAN_RESULT.findings` (Nghị định 72) cũng được bổ sung ngữ cảnh "đây là nội dung hướng dẫn/review công cụ". Verify bằng Playwright: transcript gõ ra đầy đủ, kết luận vẫn AN TOÀN.
- **Visual polish cho `/demo/video`** (KHÔNG đổi layout/animation/design token cốt lõi, chỉ thêm chi tiết trang trí dùng đúng token sẵn có):
  - Background depth: dot-grid pattern (tái dùng từ landing page) + 2 radial blur góc trên-trái/dưới-phải dùng `bg-safe` opacity rất thấp (0.06) — **không dùng `--accent`** (token đó thuộc project Recap/`website testing/`, không tồn tại trong Content Checker, đã chốt từ trước).
  - Side decorative labels (Audio Extraction, Copyright Match, Legal Review / Transcript Analysis, Visual Scan, Risk Detection) — `xl:flex`, ẩn hoàn toàn dưới `xl`, `pointer-events-none`, `aria-hidden`.
  - AI status chips (Audio Processed / Transcript Generated / Visual Scan Complete) — hiện trong khối "đã phân tích xong", style pill trung tính (`border-border bg-surface-alt`), check icon `text-safe`.
  - Timeline ngang 4 bước (Audio/Transcript/Visual Analysis/Legal Review) ngay trên card kết luận — bước Audio/Transcript phản ánh đúng trạng thái toggle (nếu tắt thì hiện dấu gạch ngang mờ thay vì check).
  - Card kết luận tăng hierarchy: `p-6`→`p-7`, icon `h-10/w-10`→`h-12/w-12`, title dòng đầu `text-base`→`text-lg`, thêm `shadow-sm`.
  - Verify Playwright desktop 1440px + mobile 390px: side label hiện đúng ở desktop, ẩn đúng ở mobile; cả 3 chip + 4 bước timeline hiện đúng; card kết luận lớn hơn rõ rệt nhưng không nặng. Screenshot lưu `design-review/video-polish-*.png`.

### Đã hoàn thành thêm (phiên gần nhất — premium visual redesign `/demo/video`)

- **Card system phân tầng theo trọng lượng thị giác** (dùng đúng `--shadow-sm/md/lg` có sẵn, không token mới): upload card (nhẹ nhất, dashed border, không shadow) → audio/transcript/analyzing block (`shadow-sm`, `border-border/80`) → card kết luận (`shadow-lg`, `rounded-3xl`, accent bar `bg-safe` ở top, icon `h-14/w-14` có `shadow-sm` riêng, divider `border-safe-border/60` tách headline khỏi finding list, title `text-xl`).
- **Header nâng cấp**: icon link đổi từ circle sang `rounded-2xl` + `shadow-md` + `ring-1 ring-black/5`, thêm eyebrow pill "Phân tích bằng AI" (tái dùng đúng pattern pill landing page: dot `bg-safe` + text uppercase), H1 `text-2xl`→`text-[28px] tracking-tight`.
- **Hover state có chọn lọc**: chỉ thêm cho phần tử thực sự clickable — `upload-zone.svelte` (component dùng chung với `/demo/image`, thêm `hover:-translate-y-0.5 hover:shadow-sm` khi không disabled — thay đổi tích cực, không phá gì ở `/demo/image`), nút "Phân tích"/"Thử lại". Các card hiển thị thông tin thuần (audio/transcript block, card kết luận) **không** có hover — quyết định có chủ đích để tránh affordance giả.
- **Spacing tăng dần về phía kết luận**: header→content `mt-10`→`mt-12`, row→analyzing `mt-4`→`mt-5`, analyzing→result `mt-4`→`mt-7`, timeline `mb-4`→`mb-5`.
- Verify Playwright: flow/logic không đổi (toggle audio off → đúng 2 khối, timeline hiện đúng bước "Audio" dạng skipped, retry hoạt động đúng), screenshot before/after desktop 1440px + mobile 390px tại `design-review/video-premium-*.png` (so với `video-polish-*-v1.png` cũ).

### Đã hoàn thành thêm (phiên gần nhất — đồng bộ hoàn toàn Web 2 theo Web 1, bỏ ưu tiên Web 3)

- **Quyết định chốt:** chỉ giữ Web 1 = AN TOÀN, Web 2 = RỦI RO CAO làm 2 web ưu tiên. **Web 3 (`content-checker-can-luu-y/`) ngừng cập nhật** — không xóa, giữ nguyên trạng thái hiện tại, không động vào trừ khi được yêu cầu lại rõ ràng.
- **Web 2 (`content-checker-rui-ro-cao/`) đã được port lại toàn bộ UI/layout/animation/card system theo đúng bản mới nhất của `PankPlace/src/routes/demo/video/+page.svelte`** (bao gồm cả 2 lượt nâng cấp visual polish + premium redesign mà Web 2 trước đó CHƯA có): background depth (dot-grid + 2 radial blur `bg-safe`), side decorative labels, header (icon `rounded-2xl` + `shadow-md` + ring, eyebrow pill "Phân tích bằng AI"), card system phân tầng shadow (`shadow-sm` cho row/analyzing block, `shadow-lg` + `rounded-3xl` + accent bar + divider cho card kết luận), AI status chips, timeline ngang 4 bước (Audio/Transcript phản ánh đúng toggle, dùng hàm `setTimelineStep()` mới viết để mô phỏng `{#each}` reactive của Svelte bằng vanilla JS), spacing rhythm tăng dần, hover state có chọn lọc.
  - **`tailwind.config` của Web 2 đã thêm `boxShadow.sm/md/lg`** khớp đúng giá trị warm-tinted trong `layout.css` của Web 1 (Tailwind CDN không tự có token này) — bắt buộc để shadow nhìn giống Web 1, không dùng shadow mặc định của Tailwind.
  - Bug thật tìm và fix trong lúc port: dòng size dưới `clip.mp4` ở khối video (lúc processing) thiếu hậu tố `"— nhấn để chọn video khác"` so với Web 1 — đã sửa trong `app.js`.
  - Verify Playwright cho cả Web 1 và Web 2, desktop 1440px + mobile 390px, 3 trạng thái (upload/processing/kết quả) + test riêng toggle audio off: layout, card system, timeline, chips, spacing đều khớp 1:1 về cấu trúc — chỉ khác nội dung (transcript, issue, badge RỦI RO CAO màu risk thay AN TOÀN màu safe, H1 "Kiểm tra video" vs "Phân tích video" — điểm khác biệt định danh có từ trước, không nằm trong phạm vi đồng bộ). Screenshot lưu `content-checker-rui-ro-cao/design-review/sync-*.png`.

### Đã hoàn thành thêm (phiên gần nhất — transcript thật + 3-issue cho Web 2)

- **Việc treo từ trước đã hoàn tất**: Web 2 (`content-checker-rui-ro-cao/app.js`) giờ dùng transcript thật về video review app ưu đãi/hoàn tiền (`TRANSCRIPT_PLACEHOLDER`, ~1118 ký tự) và `RESULT_LINES` đã đổi từ 2 issue cũ (Sony Music + phát ngôn nhạy cảm) sang **3 issue mới**: (1) Nhạc nền vi phạm bản quyền Sony Music 00:15–00:42, (2) Thông tin quảng bá chưa được xác thực 00:58–01:08, (3) Nguy cơ vi phạm quy định dữ liệu cá nhân 00:25–00:34. Summary tổng hợp đầu tiên trong `RESULT_LINES` liệt kê đủ cả 3 nhóm rủi ro, không viết chung chung.
- **Tên file demo**: `review-app-uu-dai-2026 (1080p, h264).mp4`/`.mp3` — không hardcode trong code, tự động đúng theo tên file người dùng chọn lúc demo thật (đã verify: chọn file tên này → audio block hiện đúng `.mp3` cùng tên).
- **UI/layout/animation/typing effect/processing flow giữ nguyên 100%** — chỉ sửa 2 hằng số data trong `app.js`, không đổi `index.html`.
- Verify Playwright: transcript gõ ra đầy đủ (chờ tới đoạn cuối "hẹn gặp lại trong video tiếp theo"), badge RỦI RO CAO + cả 3 issue mới xuất hiện đúng, audio filename đổi đúng đuôi `.mp3` giữ tên gốc. Screenshot closeup card kết luận tại `content-checker-rui-ro-cao/design-review/data-update-result-card-closeup.png`.

### Đã hoàn thành thêm (phiên gần nhất — ContentChecker Chatbot, chỉ Web 2)

- **Thêm chatbot demo frontend-only cho Web 2** (`content-checker-rui-ro-cao/index.html` + `app.js`) — KHÔNG đụng PankPlace/Web 1. Nút chat tròn 52px fixed bottom-right (24px desktop / 16px mobile theo `sm:` breakpoint), panel popup đồng bộ design system hiện có (border/shadow/radius/typography tái dùng nguyên token sẵn có, không thêm style mới).
  - **Token `--accent`/`#C9521C` trong yêu cầu gốc đã bị thay bằng `--color-safe`** — đúng theo quy tắc đã chốt nhiều lần trong CLAUDE.md ("`--accent` không tồn tại trong Content Checker, đó là token Recap"). Đây là lần thứ N task yêu cầu dùng token này; đã tự động áp dụng quy tắc map sẵn có, không cần hỏi lại.
  - Logic 100% hard-code, không API/backend/localStorage: mở chat → bot gửi greeting cố định (chỉ 1 lần đầu mở, không lặp lại mỗi lần toggle); gửi bất kỳ tin nhắn nào → bot hiện trạng thái "Đang phân tích cảnh báo..." (tái dùng đúng style bouncing-dots của `analyzing-block`) trong 1s → xóa trạng thái → typing effect (tái dùng `typeLine()` có sẵn, speed 18ms — nhanh hơn transcript 26ms một chút cho cảm giác chat mượt hơn, vẫn cùng cơ chế) hiện cố định nội dung "Issue A" (nguyên nhân + 4 bước xử lý + mức cải thiện dự kiến 🔴→🟡).
  - Animation mở/đóng panel tái dùng đúng hàm `flyIn()`/pattern fade đã có trong `app.js` (translateY+opacity, 220–280ms), không tạo easing/duration mới.
  - Verify Playwright desktop 1440px + mobile 390px, đủ 4 trạng thái yêu cầu (đóng/mới mở/sau khi gửi/sau khi hiện giải pháp): nội dung đúng 100%, panel không tràn màn hình mobile, nút chat không che card kết luận chính, đóng panel hoạt động đúng. Screenshot lưu `content-checker-rui-ro-cao/design-review/chatbot-*.png`.

### Đã hoàn thành thêm (phiên gần nhất — motion design Web 1: scroll reveal + page transition)

- **Xung đột rule đã xử lý:** Part 3 (page transition) theo cách chuẩn SvelteKit cần `{#key url}` trong `+layout.svelte`, nhưng CLAUDE.md cấm sửa file này. Giải pháp: dùng **View Transitions API native của browser** qua `onNavigate` (từ `$app/navigation`) — đặt trong helper `src/lib/page-transition.ts` (`setupPageTransition()`), gọi từ `<script>` của từng `+page.svelte` (4 file: `/`, `/demo`, `/demo/video`, `/demo/image`), KHÔNG đụng `+layout.svelte`. CSS keyframe (`::view-transition-old/new(root)`) đặt trong `layout.css` (file CSS thuần, không phải `.svelte`) — fade+slide nhẹ, 220ms (out)/280ms (in), tự fallback về chuyển trang tức thì ở browser không hỗ trợ (Firefox).
- **Scroll reveal** (`src/lib/reveal.ts`, Svelte action `reveal`, dùng `IntersectionObserver` thuần, không thư viện): fade (`opacity 0→1`) + slide up (`translateY 24px→0`), 600ms ease-out, trigger 1 lần khi vào viewport (threshold 0.15, rootMargin -40px), tự `unobserve` sau khi trigger (không lặp lại khi scroll lên xuống). CSS class `.reveal`/`.reveal-visible` đặt trong `layout.css`, có `prefers-reduced-motion` fallback (hiện ngay, không animate).
  - Áp dụng cho `src/routes/+page.svelte`: Hero (text trái delay 0, preview card phải delay 120ms), "Cách hoạt động" (header + 2 card, stagger 0/100ms), "Vì sao chọn" (header + 6 card, stagger theo hàng 0/80/160ms — lặp lại mỗi hàng 3 cột vì lưới `lg:grid-cols-3`).
  - KHÔNG đụng `/demo`, `/demo/video`, `/demo/image` cho phần reveal (3 trang này không có section dài cần scroll-reveal, chỉ nhận `setupPageTransition()` cho page transition).
- Verify Playwright (viewport 1440×700 để đảm bảo card cuối nằm dưới fold): card cuối "Vì sao chọn" có `opacity:0`+`transform: translateY(24px)` đúng trước khi cuộn tới, `transition-delay` đúng 0s/0.08s/0.16s lặp theo hàng; `document.startViewTransition` tồn tại (Chromium); chụp screenshot giữa lúc transition (`/`→`/demo`, `/demo`→`/demo/video`) thấy rõ crossfade 2 trang chồng lên nhau — xác nhận View Transition hoạt động thật, không chỉ đọc code. Layout/typography/màu/spacing/nội dung/logic giữ nguyên 100%, chỉ thêm 2 file mới (`reveal.ts`, `page-transition.ts`) + sửa `layout.css` + thêm `use:reveal`/`setupPageTransition()` vào 4 page file.

### Đã hoàn thành thêm (phiên gần nhất — chat FAB thuần decorative cho Web 1)

- **Thêm nút chấm tròn nổi (giống visual của chatbot Web 2) cho cả 4 trang Web 1** (`/`, `/demo`, `/demo/video`, `/demo/image`) — **KHÔNG có panel/logic chat**, chỉ đặt icon theo đúng yêu cầu rõ của user ("không cần khung chat và trả lời, chỉ cần đặt icon ra thôi").
- Tạo component dùng chung `src/lib/components/chat-fab.svelte` (button tròn 52px, `bg-safe`, icon message-square-more giống Web 2, fixed bottom-right 16px mobile/24px desktop, hover lift+shadow) — import vào từng `+page.svelte`, KHÔNG đụng `+layout.svelte` (giữ đúng rule cấm sửa root layout, nhất quán với cách làm page-transition trước đó).
- Button không có `onclick` — bấm vào không làm gì, đúng tinh thần "decorative only" user yêu cầu.
- Verify Playwright: `button[aria-label="Chat hỗ trợ"]` hiện đúng `isVisible() === true` trên cả 4 route, desktop 1440px + mobile 390px, không lỗi console. Screenshot lưu `design-review/fab-*.png`.

### Chưa làm / đang dở

- Database (`schema.ts` chỉ có bảng `task` generic, `getDb()` không được gọi ở đâu, `wrangler.jsonc` không có D1 binding) — xác nhận lại vẫn ở trạng thái chưa dùng, đúng như quyết định đã chốt.
- Visual polish + premium redesign **đã đồng bộ sang Web 2** nhưng **chưa đồng bộ sang `/demo/image`** (vẫn ở bản UI cũ, ngoại trừ hover state `upload-zone.svelte` dùng chung).
- Web 3 không còn được cập nhật theo Web 1 nữa kể từ quyết định này — sẽ lệch dần UI nếu Web 1 tiếp tục thay đổi.
- Web 1 (`PankPlace`) vẫn dùng transcript/kết quả riêng của nó (video review "Combine Design Mode", case an_toàn) — chưa đồng bộ nội dung với Web 2, đúng chủ đích vì 2 web đại diện 2 case khác nhau.

### Quyết định quan trọng đã chốt (lấy từ trao đổi thật, không suy diễn)

- **Database:** bỏ hoàn toàn cho MVP demo 1 tối — xử lý trong memory/session, không cần Postgres/D1.
- **Design tokens:** dùng đúng namespace `--color-*` thật của PankPlace (`--color-bg/surface/surface-alt/border/ink/ink-muted/ink-faint`, `--color-safe/caution/risk` + biến thể `-bg`/`-border`, `--shadow-sm/md/lg`). **Không có** `--accent` hay màu rust `#C9521C` — đó là token của project Recap (`website testing/`), bị nhầm sang PankPlace nhiều lần trong các yêu cầu trước, luôn phải verify lại và map đúng. Accent chức năng duy nhất của Content Checker là `--color-safe` (xanh lá), dùng tiết chế.
- **Toggle audio + transcript ở `/demo/video` chạy đồng thời**, không tuần tự — yêu cầu rõ từ user.
- **Layout cả `/demo/video` và `/demo/image` là kiểu cộng dồn** (pop-up thêm khối bên dưới), KHÔNG phải thay thế theo stage — sửa lại sau khi user vẽ sơ đồ tay minh họa rõ ý muốn, sau đó đồng bộ sang `/demo/image` theo yêu cầu tiếp theo.
- **`/demo/image` không cần ép đủ 3 khối** — vì ảnh không có khái niệm "audio" tương đương, chỉ giữ 2 khối [Import ảnh] – [Caption], đúng theo chỉ dẫn rõ của user.
- **Web 2/Web 3 là project độc lập hoàn toàn**, không share code/route với Web 1, chỉ động vào khi user yêu cầu rõ ràng.
- Placeholder transcript cố định `"Tuấn Minh đẹp trai quá hihi"` — chỉ tạm cho demo, sẽ thay bằng transcript thật khi user cung cấp.
- **`TopBar.svelte` đã xóa** — chốt không giữ lại.
- **Web 1 giữ cố định case "an_toàn"** — không cần hỗ trợ 3 case, vì mỗi web (1/2/3) đại diện đúng 1 case cố định theo chủ đích, không phải thiếu sót.
- **Web 2/Web 3 đã đồng bộ UI/layout/animation với Web 1**, port sang vanilla JS (không convert SvelteKit) — chỉ đồng bộ phần khung/animation, giữ nguyên nội dung kết quả riêng của mỗi web.
- **`--accent` không tồn tại trong Content Checker** — nếu yêu cầu tương lai nhắc tới `var(--accent)`, đó là nhầm từ project Recap (`website testing/`), phải map sang `--color-safe` hoặc token trung tính (`--color-ink`/`--color-border`) tùy ngữ cảnh, không tự thêm token mới.
- **Chỉ giữ ưu tiên Web 1 (AN TOÀN) + Web 2 (RỦI RO CAO)** — quyết định mới chốt, thay thế quyết định cũ "3 web độc lập đại diện 3 case". **Web 3 (CẦN LƯU Ý) ngừng được cập nhật** kể từ đây, không xóa, chỉ deprioritize.
- **Web 2 phải bám sát Web 1 gần như tuyệt đối về UI** (95% giống khi đặt cạnh nhau) — mỗi lần Web 1's `/demo/video` đổi visual, phải tự hỏi có cần đồng bộ lại Web 2 không, vì giờ đây là yêu cầu tường minh, không còn là "port một lần rồi xong".
- **Tailwind CDN không tự có `--shadow-sm/md/lg`** như Tailwind v4 build-time của Web 1 — khi port sang Web 2/3 (static HTML), phải tự thêm `boxShadow` vào `tailwind.config` với đúng giá trị warm-tinted, nếu không shadow sẽ dùng mặc định Tailwind (xám lạnh, sai tinh thần thiết kế).
- **Web 2 có ContentChecker Chatbot** (frontend demo, hard-code, không API/backend/storage) — chỉ tồn tại ở Web 2, chưa có ở Web 1. Nút chat dùng `--color-safe` thay `--accent` (token cấm, xem mục token bên trên) — bất kỳ yêu cầu chat/widget mới nào nhắc `--accent`/`#C9521C` đều áp dụng lại đúng quy tắc này, không cần hỏi lại.
- **Page transition giữa các route của Web 1 dùng View Transitions API native** (`setupPageTransition()` trong `$lib/page-transition.ts`, gọi từ từng `+page.svelte`) — KHÔNG dùng pattern `{#key url}` trong `+layout.svelte` vì rule cấm sửa root layout. Nếu thêm route mới cho Web 1 trong tương lai, phải tự thêm `setupPageTransition()` vào `<script>` của route đó (không tự động áp dụng toàn cục vì không có hook ở layout).

### Đề xuất việc tiếp theo

- `/demo/image` (Web 1) vẫn chưa có visual polish + premium redesign — nếu cần đồng bộ, đây là việc còn lại trong chính Web 1 trước khi nghĩ tới Web 2.
- Nếu mục tiêu cuối là quay video demo cả 2 web (Web 1 an_toàn + Web 2 rủi ro cao), giờ cả 2 đã có UI đồng bộ và data thật đầy đủ — có thể quay được.