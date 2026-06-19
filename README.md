# Content Checker

Web app demo giúp kiểm tra video/ảnh có vi phạm bản quyền hoặc rủi ro pháp lý (Nghị định 72, Luật An ninh mạng) trước khi đăng lên mạng xã hội.

Đây là bản demo frontend — kết quả phân tích là dữ liệu cố định (mock), chưa nối với AI/backend thật.

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Drizzle ORM](https://orm.drizzle.team) + Cloudflare D1 (đã cấu hình sẵn nhưng **chưa được dùng thật** trong code — toàn bộ flow demo chạy bằng mock data trong `src/lib/mock-results.ts`, không cần database để chạy local)

## Routes

- `/` — landing page
- `/demo` — chọn loại nội dung cần kiểm tra
- `/demo/video` — demo phân tích video (upload, toggle audio/transcript, kết quả "AN TOÀN" cố định)
- `/demo/image` — demo phân tích ảnh + caption

## Chạy local

Yêu cầu: Node.js 18+ và [pnpm](https://pnpm.io) (khuyến nghị) hoặc npm/yarn.

```sh
pnpm install
pnpm dev
```

Mở [http://localhost:5173](http://localhost:5173). **Không cần** tạo file `.env` hay xin Cloudflare credentials gì — database chưa được wire vào code nên project chạy được ngay sau `pnpm install`.

## Kiểm tra code trước khi commit

```sh
pnpm check   # type-check
pnpm lint    # prettier + eslint
```

## Build

```sh
pnpm build
pnpm preview
```

> Project dùng [adapter Cloudflare Workers](https://svelte.dev/docs/kit/adapters) để deploy — nếu chỉ chạy local thì không cần quan tâm bước này.
