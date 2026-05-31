# Real Roleplay optimization notes

## Đã tối ưu

- Đồng bộ validation whitelist giữa frontend/backend qua `validation.js`.
- Chặn độ dài input theo schema để tránh lỗi MySQL `Data too long`.
- Chặn nộp trùng khi user đang có đơn `pending` hoặc `review`.
- API whitelist trả lỗi rõ hơn cho lỗi validation, database timeout/kết nối và lỗi data quá dài.
- Nếu lưu DB thành công nhưng Discord thông báo lỗi, website vẫn báo đúng: đơn đã lưu, staff xem được trong dashboard.
- Discord embed được rút gọn an toàn theo giới hạn field 1024 ký tự và tổng embed 6000 ký tự.
- Discord message tắt `allowed_mentions` để tránh ping ngoài ý muốn.
- Route debug DB hiện chỉ admin được phép xem, không public nữa.
- Admin API có try/catch, validate id/status và limit 300 hồ sơ gần nhất để tránh load quá nặng.
- Discord interaction GET không leak trạng thái env.
- Thêm security headers cơ bản trong `next.config.mjs`.
- Schema đổi `short_description` sang `VARCHAR(80)` đúng với validation và thêm index `created_at`.
- Bot Discord cũng cắt reason field để không vượt embed field limit.

## Lưu ý deploy

- Source zip không có `node_modules`, nên máy local chưa build được nếu chưa chạy `npm install` hoặc `npm ci`.
- Sau khi upload lên host/Vercel/Railway, chạy:

```bash
npm ci
npm run build
```

- Nếu database đã tạo bảng cũ, chạy migration này trong MySQL để đồng bộ schema:

```sql
ALTER TABLE whitelist_applications MODIFY short_description VARCHAR(80) NOT NULL;
CREATE INDEX idx_created_at ON whitelist_applications (created_at);
```

Nếu index đã tồn tại thì MySQL sẽ báo duplicate index, có thể bỏ qua.
