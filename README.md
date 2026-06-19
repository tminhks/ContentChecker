# Content Checker

Web app demo giúp kiểm tra video/ảnh có vi phạm bản quyền hoặc rủi ro pháp lý (Nghị định 72, Luật An ninh mạng) trước khi đăng lên mạng xã hội.

Đây là bản demo frontend — kết quả phân tích là dữ liệu cố định (mock), chưa nối với AI/backend thật.

## Trạng thái dự án

Repo này được công khai **chỉ để phục vụ việc đánh giá hồ sơ/proposal**, không phải để clone về chạy thử. Bản demo đầy đủ (giao diện, luồng phân tích, kết quả) được trình bày qua **video demo** đã gửi kèm proposal.

Mã nguồn và toàn bộ nội dung trong repo thuộc bản quyền của tác giả — xem [LICENSE](LICENSE). Việc tải, sao chép, build hoặc triển khai lại dưới bất kỳ hình thức nào đều cần được tác giả đồng ý trước.

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Drizzle ORM](https://orm.drizzle.team) + Cloudflare D1 (đã cấu hình sẵn nhưng chưa được dùng thật trong code)

## Routes

- `/` — landing page
- `/demo` — chọn loại nội dung cần kiểm tra
- `/demo/video` — demo phân tích video (upload, toggle audio/transcript, kết quả "AN TOÀN" cố định)
- `/demo/image` — demo phân tích ảnh + caption

## Liên hệ

Mọi câu hỏi về dự án, vui lòng liên hệ trực tiếp tác giả qua kênh đã trao đổi cùng proposal.
