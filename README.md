# 📚 Web Bán Sách - Bookstore Website

Một ứng dụng web bán sách được xây dựng với React.js (Frontend) và Node.js/Express (Backend), sử dụng MongoDB làm cơ sở dữ liệu.

## 🚀 Tính năng chính

- **Người dùng:**
  - Đăng ký/Đăng nhập tài khoản
  - Xác thực tài khoản qua email
  - Đăng nhập với Google
  - Duyệt và tìm kiếm sách
  - Xem chi tiết sách và đánh giá
  - Thêm sách vào giỏ hàng
  - Đặt hàng và theo dõi đơn hàng
  - Sử dụng voucher giảm giá
  - Chat hỗ trợ

- **Admin:**
  - Quản lý sản phẩm (thêm, sửa, xóa)
  - Quản lý đơn hàng
  - Quản lý người dùng
  - Quản lý voucher
  - Xem thống kê doanh thu

## 🛠 Công nghệ sử dụng

### Frontend
- **React.js** - Thư viện UI
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Routing
- **React Icons** - Icons
- **Highcharts** - Biểu đồ thống kê
- **QR Code** - Tạo mã QR

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Cơ sở dữ liệu
- **Mongoose** - ODM cho MongoDB
- **JWT** - Authentication
- **Bcrypt** - Mã hóa mật khẩu
- **Cloudinary** - Lưu trữ hình ảnh
- **Nodemailer** - Gửi email
- **Google Auth** - Đăng nhập Google

## 📋 Yêu cầu hệ thống

- **Node.js** >= 16.0.0
- **npm** hoặc **yarn**
- **MongoDB** (local hoặc MongoDB Atlas)
- **Git**

## 🔧 Cài đặt và chạy ứng dụng

### 1. Clone repository

```bash
git clone https://github.com/ngocchau04/ktpm-webbansach.git
cd webbansach
```

### 2. Cài đặt Backend

```bash
# Di chuyển vào thư mục Backend
cd Backend

# Cài đặt dependencies
npm install
```

### 3. Cấu hình môi trường Backend

Tạo file `.env` trong thư mục `Backend` (hoặc sử dụng file hiện có):

```env
# Database
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/shopbook

# JWT Secret
SECRET_KEY=your_secret_key

# Server Port
PORT=3001

# Google OAuth (để đăng nhập Google)
CLIENT_ID="your-google-client-id"
CLIENT_SECRET="your-google-client-secret"
REFRESH_TOKEN="your-google-refresh-token"

# Email Service (để gửi email xác thực)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Lưu ý:** 
- Thay thế các giá trị `your-*` bằng thông tin thực tế của bạn
- Để lấy Google OAuth credentials, truy cập [Google Cloud Console](https://console.cloud.google.com/)
- Email password là App Password, không phải mật khẩu Gmail thường

### 4. Cài đặt Frontend

```bash
# Mở terminal mới và di chuyển vào thư mục Frontend
cd ../FrontEnd

# Cài đặt dependencies
npm install
```

### 5. Chạy ứng dụng

#### Chạy Backend (Terminal 1):
```bash
cd Backend
npm start
```
Server sẽ chạy trên: http://localhost:3001

#### Chạy Frontend (Terminal 2):
```bash
cd FrontEnd
npm run dev
```
Ứng dụng sẽ chạy trên: http://localhost:5173

## 🗄 Cấu trúc dự án

```
webbansach/
├── Backend/
│   ├── controllers/         # Logic xử lý business
│   ├── models/             # Mongoose schemas
│   ├── services/           # Services (Cloudinary, Email)
│   ├── sample*.js          # Dữ liệu mẫu
│   ├── index.js            # Entry point
│   └── package.json
├── FrontEnd/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── assets/         # Hình ảnh, icons
│   │   ├── components/     # React components
│   │   ├── context/        # Context API
│   │   ├── pages/          # Các trang chính
│   │   ├── utils/          # Utilities
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   └── package.json
└── README.md
```

## 📊 API Endpoints chính

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/google` - Đăng nhập Google
- `POST /api/auth/verify` - Xác thực tài khoản

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng
- `PUT /api/orders/:id` - Cập nhật đơn hàng

### Users
- `GET /api/users` - Lấy danh sách người dùng (Admin)
- `GET /api/users/profile` - Lấy thông tin profile
- `PUT /api/users/profile` - Cập nhật profile

## 🔒 Tài khoản Admin mặc định

Sau khi khởi tạo dữ liệu, bạn có thể sử dụng:
- **Email:** thanhdev38@gmail.com
- **Password:** 123456789

## 🎯 Sử dụng ứng dụng

### Dành cho Khách hàng:
1. Truy cập http://localhost:5173
2. Đăng ký tài khoản mới hoặc đăng nhập
3. Duyệt danh mục sách
4. Thêm sách vào giỏ hàng
5. Thanh toán và theo dõi đơn hàng

### Dành cho Admin:
1. Đăng nhập với tài khoản admin
2. Truy cập http://localhost:5173/admin
3. Quản lý sản phẩm, đơn hàng, người dùng

## 🚨 Troubleshooting

### Lỗi thường gặp:

1. **Cannot connect to MongoDB:**
   - Kiểm tra MONGO_URI trong file .env
   - Đảm bảo MongoDB đang chạy (nếu dùng local)

2. **Port đã được sử dụng:**
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   
   # Hoặc thay đổi PORT trong .env
   ```

3. **CORS Error:**
   - Đảm bảo Backend đang chạy trên port 3001
   - Kiểm tra cấu hình CORS trong Backend

4. **Email không gửi được:**
   - Bật 2-Factor Authentication cho Gmail
   - Tạo App Password thay vì dùng mật khẩu thường

## 📝 Ghi chú phát triển

### Thêm dữ liệu mẫu:
```bash
# Chạy các file sample để thêm dữ liệu mẫu
node sampleProduct_A.js
node sampleVoucher.js
```

### Build cho production:
```bash
# Frontend
cd FrontEnd
npm run build

# Backend - cần cấu hình thêm cho production
```

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request



## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

--------

9 USE CASES CHÍNH CỦA HỆ THỐNG WEB BÁN SÁCH
1. User Registration & Authentication
Mô tả: Đăng ký và xác thực tài khoản cá nhân
Bao gồm: Đăng ký, xác thực email, đăng nhập, đăng nhập Google, quên mật khẩu
2. Browse & Search Products
Mô tả: Duyệt và tìm kiếm sách trong cửa hàng
Bao gồm: Xem danh sách sách, tìm kiếm, lọc theo thể loại/tác giả/giá, sắp xếp
3. View Product Details
Mô tả: Xem thông tin chi tiết và đánh giá của sách
Bao gồm: Xem chi tiết sách, đọc mô tả, xem đánh giá, xem sách tương tự
4. Manage Shopping Cart
Mô tả: Quản lý giỏ hàng mua sắm
Bao gồm: Thêm vào giỏ, xem giỏ hàng, cập nhật số lượng, xóa sản phẩm
5. Manage Wishlist
Mô tả: Quản lý danh sách sách yêu thích
Bao gồm: Thêm vào yêu thích, xem danh sách yêu thích, xóa khỏi yêu thích
6. Place & Track Orders
Mô tả: Đặt hàng và theo dõi đơn hàng
Bao gồm: Tạo đơn hàng, thanh toán, xem lịch sử đơn hàng, theo dõi trạng thái
7. Apply Vouchers & Promotions
Mô tả: Sử dụng mã giảm giá và khuyến mãi
Bao gồm: Xem voucher available, áp dụng mã giảm giá, kiểm tra điều kiện voucher
8. Profile Management
Mô tả: Quản lý thông tin cá nhân
Bao gồm: Cập nhật profile, nhận email thông báo, đổi mật khẩu

---

## Thành viên:
3122411020 - Đàm Thị Ngọc Châu (Trưởng nhóm)
3122411173 - Võ Hoàng Kim Quyên
3122411243 - Phan Thị Hải Vân
