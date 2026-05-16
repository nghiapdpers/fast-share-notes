# Fast Share Notes 🚀

Một ứng dụng web giúp chia sẻ ghi chú văn bản cực nhanh, bảo mật với mã hóa đầu cuối (E2EE) và tự hủy sau 5 phút.

## ✨ Tính năng
- **Mã hóa AES-256:** Nội dung được mã hóa ngay tại trình duyệt.
- **Tự hủy sau 5 phút:** Đảm bảo tính riêng tư cho việc chia sẻ nhanh.
- **QR Code:** Quét mã để xem nhanh trên điện thoại.
- **Link tự giải mã:** Link chia sẻ bao gồm cả khóa giải mã ở phần URL fragment.

## 🛠️ Công nghệ
- **Frontend:** React + Vite
- **Backend:** Supabase
- **Security:** Crypto-JS (AES)
- **Deployment:** GitHub Pages + GitHub Actions

## 🚀 Cài đặt địa phương
1. Clone repo này.
2. Chạy `npm install`.
3. Tạo file `.env` từ `.env.example` và điền thông tin Supabase.
4. Chạy `npm run dev`.

## 📦 Deploy
Dự án được cấu hình tự động deploy qua GitHub Actions. Hãy nhớ thêm `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` vào **GitHub Secrets**.
