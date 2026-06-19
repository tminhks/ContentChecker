# Content Checker

Ý tưởng sản phẩm: công cụ kiểm tra video/ảnh có vi phạm bản quyền hoặc rủi ro pháp lý (Nghị định 72, Luật An ninh mạng) trước khi đăng lên mạng xã hội.

Repo này trình bày ý tưởng dưới dạng **prototype giao diện** — luồng tương tác, layout, animation đã được dựng đầy đủ để minh họa trải nghiệm sản phẩm, nhưng phần phân tích bên dưới (bản quyền, pháp lý, chatbot) đang dùng dữ liệu cố định để demo, chưa nối engine AI/backend thật. Bản trình diễn đầy đủ được trình bày qua **video demo** đã gửi kèm proposal.

## Thuật toán phân tích

Khi người dùng tải video lên, hệ thống xử lý đồng thời 3 lớp nội dung:

- **Hình ảnh** — cắt 1 frame mỗi giây từ video, đối soát từng frame (image matching/hashing) với cơ sở dữ liệu hình ảnh/logo đã biết là vi phạm. Mốc 1 frame/giây đủ để bắt hầu hết nội dung vi phạm xuất hiện trong khung hình mà không phải xử lý toàn bộ chuỗi frame gốc (video 30fps có hàng nghìn frame/phút), vẫn định vị được mốc vi phạm chính xác tới từng giây.
- **Âm thanh** — đối soát mẫu âm thanh (audio fingerprinting) với cơ sở dữ liệu bản quyền để phát hiện nhạc/clip có bản quyền, kể cả khi đã bị cắt đoạn hoặc đổi tốc độ.
- **Lời nói và caption** — chuyển giọng nói thành văn bản (speech-to-text), đối chiếu nội dung transcript và caption với câu chữ cụ thể của Nghị định 72/2013 và Luật An ninh mạng 2018 bằng mô hình NLP.

Kết quả 3 lớp được tổng hợp thành một kết luận theo 3 mức — AN TOÀN / CẦN LƯU Ý / RỦI RO CAO — kèm mốc thời gian và điều khoản liên quan cho từng vấn đề phát hiện được.

## Kế hoạch phát triển

Nếu được lựa chọn để đi vào các vòng tiếp theo, hướng phát triển từ prototype này lên sản phẩm hoạt động thật gồm:

1. **Nối thuật toán phân tích ở trên với engine thật** — hiện luồng UI và kết quả đang minh họa bằng dữ liệu cố định; bước này thay bằng pipeline xử lý frame/audio/transcript thật chạy trên video người dùng tải lên.
2. **Engine phân tích rủi ro pháp lý** — huấn luyện/tinh chỉnh mô hình NLP gắn nhãn rủi ro kèm trích dẫn điều khoản cụ thể, thay vì kết luận chung.
3. **Chatbot hỗ trợ nối API LLM thật** — thay phản hồi cố định bằng API của một mô hình ngôn ngữ (ví dụ Anthropic Claude/OpenAI), kết hợp RAG trên tập văn bản luật đã có để trả lời theo đúng văn bản pháp luật, không bịa nội dung.
4. **Backend lưu lịch sử kiểm tra** — kết nối Cloudflare D1 (đã cấu hình sẵn trong repo nhưng chưa dùng) để lưu lịch sử các lần kiểm tra, trạng thái xử lý theo từng job (video dài cần xử lý bất đồng bộ).
5. **Xác thực người dùng** — thêm đăng nhập/đăng ký thật để mỗi tài khoản quản lý được lịch sử kiểm tra của riêng mình.

## Tech stack hiện tại (prototype)

- [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Drizzle ORM](https://orm.drizzle.team) + Cloudflare D1 (đã cấu hình sẵn, sẽ dùng thật ở bước 4 của kế hoạch phát triển)

## Routes

- `/` — landing page
- `/demo` — chọn loại nội dung cần kiểm tra
- `/demo/video` — demo phân tích video (upload, toggle audio/transcript, kết quả "AN TOÀN" cố định)
- `/demo/image` — demo phân tích ảnh + caption

## Bản quyền

Mã nguồn và toàn bộ nội dung trong repo thuộc bản quyền của tác giả — xem [LICENSE](LICENSE). Repo công khai để phục vụ đánh giá proposal, không phải để clone/triển khai lại; việc đó cần được tác giả đồng ý trước.

## Liên hệ

Mọi câu hỏi về dự án, vui lòng liên hệ trực tiếp tác giả qua kênh đã trao đổi cùng proposal.
