# Fast Share Notes 🚀

Một ứng dụng web giúp chia sẻ ghi chú văn bản cực nhanh, bảo mật tối đa với mã hóa đầu cuối (E2EE) và tự hủy sau 5 phút.

## ✨ Tính năng nổi bật

- **🔐 Bảo mật tuyệt đối (E2EE):** Ghi chú được mã hóa bằng thuật toán AES-256 ngay tại trình duyệt. Khóa giải mã không bao giờ được gửi lên máy chủ.
- **⏳ Tự hủy sau 5 phút:** Mọi dữ liệu sẽ tự động biến mất sau 5 phút để đảm bảo tính riêng tư.
- **🔑 Truy cập bằng mã:** Ngoài link, bạn có thể chia sẻ mã ngắn (ví dụ: `A1B2C3-XXXX`) để người nhận nhập thủ công.
- **📱 QR Code thông minh:** Tạo mã QR tự động để chia sẻ nhanh chóng giữa các thiết bị.
- **🔗 Link tự giải mã:** Khóa giải mã được đính kèm vào URL fragment (#), giúp người nhận xem nội dung chỉ với một cú click mà vẫn đảm bảo an toàn.
- **🎨 Giao diện hiện đại:** Thiết kế Glassmorphism, Dark Mode mặc định và hiệu ứng mượt mà.

## 🛡️ Cơ chế bảo mật (E2EE)

Ứng dụng sử dụng mô hình mã hóa tại máy khách (Client-side encryption):
1. **Mã hóa:** Khi bạn nhấn "Tạo ghi chú", một khóa ngẫu nhiên được tạo ra. Nội dung được mã hóa bằng `Crypto-JS (AES-256)`.
2. **Lưu trữ:** Chỉ có bản mã (ciphertext) được gửi lên Supabase.
3. **Chia sẻ:** Khóa giải mã được đặt sau dấu `#` trong URL (ví dụ: `?id=abc#KEY`). Các trình duyệt không bao giờ gửi phần sau dấu `#` về server.
4. **Giải mã:** Trình duyệt người nhận lấy khóa từ URL fragment để giải mã nội dung ngay tại chỗ.

## 🛠️ Công nghệ sử dụng

- **Frontend:** React + Vite
- **Styling:** Vanilla CSS (Modern CSS variables, Flexbox/Grid)
- **Backend:** Supabase (Database & RLS)
- **Security:** Crypto-JS
- **Icons:** Lucide React

## 🚀 Hướng dẫn cài đặt chi tiết

### 1. Chuẩn bị Backend (Supabase)

1. Truy cập [Supabase](https://supabase.com/) và tạo một dự án mới.
2. Vào mục **SQL Editor**, tạo một query mới và dán nội dung từ file `supabase_schema.sql` trong thư mục gốc của dự án này.
3. Nhấn **Run** để khởi tạo bảng `notes` và các chính sách bảo mật (RLS).
4. (Tùy chọn) Bật extension `pg_cron` trong mục **Database -> Extensions** nếu bạn muốn tự động xóa dữ liệu hết hạn trên server.

### 2. Cài đặt mã nguồn

```bash
# Clone dự án
git clone https://github.com/your-username/fast-share-notes.git

# Cài đặt dependencies
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` tại thư mục gốc và điền các thông tin lấy từ dự án Supabase của bạn (**Project Settings -> API**):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Chạy dự án

```bash
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

## 📦 Triển khai (Deployment)

Dự án đã tích hợp sẵn **GitHub Actions** để tự động deploy lên **GitHub Pages**.

1. Đẩy code lên GitHub repository của bạn.
2. Truy cập **Settings -> Secrets and variables -> Actions**.
3. Thêm 2 secret sau:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vào tab **Actions**, chọn workflow và nhấn run (hoặc code sẽ tự deploy khi bạn push lên nhánh `main`).

## 🤝 Đóng góp

Mọi đóng góp nhằm cải thiện tính bảo mật và trải nghiệm người dùng đều được chào đón. Hãy mở một Issue hoặc Pull Request!

---
Dự án được phát hành dưới giấy phép MIT. 
