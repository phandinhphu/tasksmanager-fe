# Tasks Manager FE

Đây là dự án giao diện người dùng (frontend) cho ứng dụng **Quản lý công việc cá nhân**, phát triển bằng React và Vite. Ứng dụng hỗ trợ người dùng tạo, theo dõi, chỉnh sửa, phân loại và hoàn thành các công việc hàng ngày, đồng thời quản lý lịch học, nhận thông báo nhắc nhở và tối ưu hóa hiệu suất cá nhân.

## Tính năng nổi bật

- **Quản lý công việc**: Thêm, sửa, xóa task chính và task phụ (subtask).
- **Phân loại & tìm kiếm**: Lọc, tìm kiếm công việc theo trạng thái, độ ưu tiên.
- **Đánh dấu hoàn thành**: Đánh dấu task/subtask đã hoàn thành với hiệu ứng trực quan.
- **Quản lý deadline**: Theo dõi công việc quá hạn, sắp đến hạn, đã hoàn thành.
- **Lên lịch học**: Tạo, chỉnh sửa, xóa lịch học, hỗ trợ lặp lại theo tuần/ngày.
- **Thông báo nhắc nhở**: Nhận thông báo real-time khi đến hạn công việc qua socket.
- **Giao diện hiện đại**: Sử dụng Material UI, responsive, dễ sử dụng.
- **Phân trang**: Hiển thị danh sách công việc với phân trang tiện lợi.

## Công nghệ sử dụng

- [React](https://react.dev/) & [Vite](https://vitejs.dev/): Xây dựng giao diện người dùng hiện đại, hiệu năng cao.
- [Material UI (MUI)](https://mui.com/): Thư viện UI chuyên nghiệp, hỗ trợ responsive.
- [React Query](https://tanstack.com/query/latest): Quản lý trạng thái và cache dữ liệu bất đồng bộ.
- [Axios](https://axios-http.com/): Giao tiếp API backend.
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti): Hiệu ứng khi hoàn thành task.
- [Socket.io](https://socket.io/): Nhận thông báo nhắc nhở real-time.

## Cấu trúc thư mục

```
.
├── public/             # Tài nguyên tĩnh (favicon, ảnh, ...)
├── src/
│   ├── assets/         # Ảnh, icon dùng trong app
│   ├── components/     # Các component dùng chung (CardTask, Dialog, Menu, ...)
│   ├── contexts/       # React context (quản lý state toàn cục)
│   ├── hooks/          # Custom hooks
│   ├── layouts/        # Layout tổng thể
│   ├── pages/          # Các trang chính (Home, Tasks, AddTask, Help, ...)
│   ├── routes/         # Định tuyến trang
│   ├── services/       # Giao tiếp API (taskServices, ...)
│   ├── utils/          # Hàm tiện ích, cấu hình socket, ...
│   ├── App.jsx         # Component gốc
│   ├── main.jsx        # Điểm khởi tạo ứng dụng
│   └── index.css       # CSS tổng
├── db.json             # (Nếu có) Dữ liệu mẫu cho mock API
├── package.json        # Thông tin dự án & dependencies
├── vite.config.js      # Cấu hình Vite
├── README.md           # Tài liệu này
└── .env.development   # Biến môi trường (API endpoint, ...)
```

## Hướng dẫn cài đặt & chạy dự án

1. **Cài đặt dependencies**
    ```sh
    npm install
    ```
2. **Chạy dự án**
    ```sh
    npm run dev
    ```
3. **Build production**
    ```sh
    npm run build
    ```
4. **Chạy server mock API** (nếu có)
    ```sh
    npm run start:api
    ```
5. **Kiểm tra code với ESLint**
    ```sh
    npm run lint
    ```

## Hướng dẫn sử dụng

1. **Tạo tài khoản**: Đăng ký tài khoản mới hoặc đăng nhập nếu đã có tài khoản.
2. **Tạo công việc**: Nhấn nút "Thêm công việc" để tạo task mới.
3. **Quản lý công việc**: Sử dụng các tính năng lọc, tìm kiếm, chỉnh sửa và xóa công việc.
4. **Lên lịch học**: Tạo lịch học mới và chỉnh sửa theo nhu cầu.
5. **Nhận thông báo**: Nhận thông báo nhắc nhở khi đến hạn công việc qua socket.
6. **Tùy chỉnh giao diện**: Thay đổi chủ đề và giao diện theo sở thích cá nhân.
7. **Xem hướng dẫn**: Truy cập trang "Hướng dẫn" để biết thêm thông tin chi tiết về cách sử dụng ứng dụng.

## Tài liệu tham khảo

- [React](https://reactjs.org/docs/getting-started.html)
- [Vite](https://vitejs.dev/guide/)
- [Material UI (MUI)](https://mui.com/getting-started/installation/)
- [React Query](https://tanstack.com/query/latest/docs/overview)
- [Axios](https://axios-http.com/docs/intro)
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- [Socket.io](https://socket.io/docs/v4/)
- [React Router](https://reactrouter.com/en/main/start/overview)
- [ESLint](https://eslint.org/docs/user-guide/getting-started)

## Đóng góp

Nếu bạn muốn đóng góp vào dự án này, vui lòng tạo một pull request hoặc mở issue để thảo luận về các thay đổi. Mọi ý kiến đóng góp đều được hoan nghênh!

## Tác giả

- **Nguyễn Văn A** - [GitHub](https://github.com/nguyenvana)
- **Trần Thị B** - [GitHub](https://github.com/tranthib)
