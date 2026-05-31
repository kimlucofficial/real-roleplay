# Railway setup cho Real Roleplay

Source này đã chỉnh để ưu tiên Railway MySQL.

## Env database được hỗ trợ

App sẽ tự tìm theo thứ tự:

1. `MYSQL_URL` - Railway tự cấp khi service web/bot nằm cùng project với MySQL.
2. `MYSQL_PUBLIC_URL` - dùng khi chạy từ ngoài Railway hoặc cần public proxy.
3. `DATABASE_URL` - fallback nếu bạn tự copy connection string vào biến này.
4. Bộ biến riêng: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`.

## Khuyên dùng

Nếu website và bot đều deploy trên Railway cùng project với MySQL:

- Không cần Aiven.
- Không cần `?ssl-mode=REQUIRED`.
- Dùng `MYSQL_URL` / reference variables của Railway.
- Database name mặc định của Railway thường là `railway`.

Nếu website deploy ở Vercel còn MySQL ở Railway:

- Copy Public URL của Railway MySQL vào `DATABASE_URL` hoặc `MYSQL_PUBLIC_URL` trên Vercel.
- Chạy `schema.sql` một lần trong database `railway`.

## Test nhanh

Sau khi deploy, mở route debug DB bằng admin Discord account nếu cần:

`/api/debug/db`

Route này đã được khóa admin bằng `ALLOWED_ADMIN_IDS`.
