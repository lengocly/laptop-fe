# BetaTech Frontend

Giao diện website thương mại điện tử bán laptop BetaTech, được xây dựng bằng
React và Vite. Đây là frontend thuộc đồ án tốt nghiệp ngành Hệ thống thông tin
của sinh viên **Lê Thị Ngọc Ly - 2251162068 - 64HTTT1**, Trường Đại học Thủy lợi.

## Chức năng

- Xem, tìm kiếm, lọc và so sánh sản phẩm.
- Xem chi tiết và lựa chọn biến thể sản phẩm.
- Quản lý giỏ hàng và danh sách yêu thích.
- Đăng ký, đăng nhập và quản lý tài khoản.
- Lưu voucher, đặt hàng và thanh toán COD hoặc Stripe.
- Theo dõi lịch sử và trạng thái đơn hàng.
- Đánh giá sản phẩm đã mua.
- Tư vấn sản phẩm qua trợ lý AI.
- Trang quản trị sản phẩm, đơn hàng, voucher và thống kê doanh thu.

## Công nghệ

- React 18
- Vite
- React Router
- Axios
- SCSS Modules
- Recharts
- Stripe.js

## Cài đặt

Yêu cầu Node.js và npm.

```bash
git clone https://github.com/lengocly/laptop-fe.git
cd laptop-fe
npm install
cp .env.example .env
npm run dev
```

Trên Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm run dev
```

Ứng dụng mặc định chạy tại `http://localhost:5173`.

## Biến môi trường

Tạo file `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

Không đưa file `.env` hoặc khóa Stripe thật lên GitHub.

## Scripts

```bash
npm run dev       # Chạy môi trường phát triển
npm run build     # Tạo bản build production
npm run preview   # Xem trước bản build
```

## Cấu trúc chính

```text
src/
├── apis/          # Các service gọi Laravel API
├── assets/        # Hình ảnh và SCSS
├── components/    # Trang và thành phần giao diện
├── contexts/      # Auth, cart, wishlist, compare
├── hooks/
├── routers/
└── utils/
```

## Backend

Laravel REST API của dự án:
[github.com/lengocly/laptop-be](https://github.com/lengocly/laptop-be)

## Tác giả

**Lê Thị Ngọc Ly**

Đồ án: *Xây dựng hệ thống website thương mại điện tử bán laptop cho cửa hàng
công nghệ BetaTech*.
