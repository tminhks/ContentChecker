export type AnalysisLevel = 'safe' | 'caution' | 'risk';

export type AnalysisFinding = {
	label: string;
	detail: string;
};

export type AnalysisResult = {
	level: AnalysisLevel;
	badge: string;
	summary: string;
	findings: AnalysisFinding[];
};

/* ─── Video analysis (fixed: an_toan) ───────────────────── */
export const AN_TOAN_RESULT: AnalysisResult = {
	level: 'safe',
	badge: 'AN TOÀN',
	summary:
		'Không phát hiện vi phạm bản quyền hoặc nội dung nhạy cảm theo quy định pháp luật Việt Nam.',
	findings: [
		{
			label: 'Bản quyền âm thanh',
			detail: 'Không phát hiện trùng khớp với cơ sở dữ liệu bản quyền.'
		},
		{ label: 'Bản quyền hình ảnh', detail: 'Không phát hiện trùng khớp.' },
		{
			label: 'Nghị định 72',
			detail:
				'Không phát hiện nội dung vi phạm quy định quản lý thông tin trên mạng — đây là nội dung hướng dẫn/review công cụ, không có yếu tố nhạy cảm.'
		},
		{ label: 'Luật An ninh mạng', detail: 'Không phát hiện ngôn từ hoặc phát ngôn vi phạm.' }
	]
};

/* Shortened, demo-ready transcript for the fixed "an_toan" video (web design tool review). */
export const TRANSCRIPT_PLACEHOLDER =
	'Hello, xin chào mọi người. Chắc là ai cũng đã từng dùng AI để tạo những cái website khác nhau và mình cũng vậy. Nhưng mà đa số những cái người mà dùng AI để tạo website thì cái web họ tạo ra luôn luôn là nhìn nó giống AI. Hôm nay mình sẽ cùng các bạn tạo nên một cái nền tảng học tập trực tuyến chỉ trong vài phút với một cái công cụ tên là Combine Design Mode. Mình khuyên mọi người thì nên bắt đầu với cả cái plan mode là chế độ lên kế hoạch. Xây dựng một cái website có thể không khó nhưng mà xây dựng được một cái hệ thống frontend đẹp có tính nhất quán cao và code sạch, chỉnh sửa dễ mà lại tiết kiệm thời gian thì mình nghĩ là một công việc khá là khó. Nếu bạn nào đang muốn làm frontend hoặc là muốn đẩy nhanh tiến độ của một dự án cá nhân thì bạn có thể check cái đường link mà Dũng để ở phần mô tả.';

/* ─── Image analysis (fixed: an_toan) ───────────────────── */
export const AN_TOAN_IMAGE_RESULT: AnalysisResult = {
	level: 'safe',
	badge: 'AN TOÀN',
	summary: 'Không phát hiện vi phạm bản quyền hoặc nội dung nhạy cảm trong ảnh và caption.',
	findings: [
		{ label: 'Hình ảnh', detail: 'Không phát hiện logo hoặc nội dung có bản quyền trùng khớp.' },
		{ label: 'Caption', detail: 'Không phát hiện ngôn từ vi phạm Luật An ninh mạng.' },
		{
			label: 'Nghị định 72',
			detail: 'Không phát hiện nội dung vi phạm quy định quản lý thông tin trên mạng.'
		}
	]
};
