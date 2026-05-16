# PROJECT_OVERVIEW.md
> **⚠️ AI Agent: Đọc file này TRƯỚC KHI làm bất kỳ task nào trong project này.**

**Project:** Fast Share Notes (Quick Text Sharing)

**Last Updated:** 2026-05-16
**Tech Stack:** React (Vite), CSS Vanilla, Supabase, Crypto-JS
**License:** MIT

---

## 1. Architecture Overview
- **Frontend:** Single Page Application (SPA) built with Vite + React.
- **Backend:** Supabase for persistent storage.
- **Hosting:** GitHub Pages.
- **Security:** **End-to-End Encryption (E2EE)**. Ghi chú được mã hóa bằng AES-256 trong trình duyệt trước khi gửi lên Supabase. Key giải mã được lưu ở phần URL Fragment (#) để không bao giờ gửi lên server.
- **Data Flow:** 
  1. Người dùng nhập note -> App tạo Key ngẫu nhiên -> Mã hóa nội dung -> Lưu Ciphertext vào Supabase với một `short_id`.
  2. App trả về link: `domain.com/?id=SHORT_ID#ENCRYPTION_KEY`.
  3. Người nhận click link -> App lấy Ciphertext từ Supabase bằng `SHORT_ID` -> Giải mã bằng `ENCRYPTION_KEY` từ Fragment.

## 2. Technology Stack & Decisions
- **Vite + React:** Nhanh, hiện đại, quản lý state tốt.
- **Supabase:** Lưu trữ Ciphertext và quản lý Short IDs.
- **Crypto-JS:** Thực hiện mã hóa AES trong trình duyệt.
- **lucide-react:** Icons hiện đại.
- **qrcode.react:** Tạo mã QR code.

## 3. Project Structure
- `/src`: Toàn bộ logic React components.
- `/public`: Các asset tĩnh.

## 4. Key Features & Status
- [x] Create Note (Markdown support) - Done
- [x] E2EE (AES-256) - Done
- [x] Generate Short ID (6 chars) & QR Code - Done
- [x] Auto-expire (5 minutes) - Done
- [x] View note with auto-decryption - Done

## 5. Established Patterns & Conventions
- **UI/UX:** Premium Aesthetics, Dark Mode, Micro-animations, Glassmorphism.
- **Privacy First:** Nội dung note không bao giờ được lưu dưới dạng text thô trên server.

## 6. Domain Rules & Business Logic
- **Expiration:** Note tự động hết hạn sau **5 phút**. 
- **Query Logic:** App sẽ lọc bỏ các note đã quá 5 phút ngay tại client-side hoặc dùng RLS/Edge Functions (nếu có thể).

## 7. Known Issues & Gotchas
- Vì dùng URL Fragment cho key giải mã, nếu người dùng làm mất link sẽ không bao giờ khôi phục được note.

## 8. Changelog (newest first)
| Date | Change | Author |
|------|--------|--------|
| 2026-05-17 | Centered countdown badge and improved layout alignment on view screen | Antigravity |
| 2026-05-17 | Added real-time countdown timer for shared and viewed notes | Antigravity |
| 2026-05-17 | Refactored UI: removed inline styles, added utility classes for maintenance | Antigravity |
| 2026-05-17 | Reduced overall font sizes and adjusted mobile layout for better density | Antigravity |
| 2026-05-17 | Improved mobile responsiveness (padding, font sizes, media queries) | Antigravity |
| 2026-05-16 | Updated stack to React & E2EE, set expiration to 5m | Antigravity |
| 2026-05-16 | Initial overview created | Antigravity |
