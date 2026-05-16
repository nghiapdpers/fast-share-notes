-- Bảng lưu trữ ghi chú mã hóa
create table notes (
  id uuid default gen_random_uuid() primary key,
  short_id text not null unique,
  content text not null, -- Đây là ciphertext đã mã hóa AES-256
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  expires_at timestamp with time zone not null
);

-- Index để tìm kiếm nhanh theo short_id
create index idx_notes_short_id on notes(short_id);

-- Row Level Security (RLS)
alter table notes enable row level security;

-- CHÍNH SÁCH BẢO MẬT NÂNG CAO:
-- 1. Chỉ cho phép đọc các note CHƯA HẾT HẠN
create policy "Allow public read"
on notes for select
using (expires_at > now());

-- 2. Cho phép tạo note nhưng giới hạn nội dung (đã kiểm tra ở client)
create policy "Allow public insert"
on notes for insert
with check (true);

------------------------------------------------------------------
-- (Tùy chọn) TỰ ĐỘNG XÓA GHI CHÚ HẾT HẠN (Sử dụng pg_cron)
-- Bước 1: Vào Database -> Extensions -> Bật "pg_cron"
------------------------------------------------------------------

-- 1. Tạo function xóa note hết hạn
create or replace function delete_expired_notes()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.notes
  where expires_at < now();
end;
$$;

-- 2. Lập lịch chạy mỗi 1 phút
-- select cron.schedule(
--   'delete-notes-every-minute',
--   '* * * * *',
--   'select delete_expired_notes()'
-- );
