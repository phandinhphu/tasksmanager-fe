# 📋 Tasks Manager Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-7.0.2-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

_Ứng dụng quản lý công việc cá nhân và lịch học hiện đại, được xây dựng với React & Material-UI_

[📱 Demo Live](#) | [📖 Tài liệu](#tài-liệu-tham-khảo) | [🐛 Báo lỗi](https://github.com/phandinhphu/tasksmanager-fe/issues)

</div>

## ✨ Tính năng chính

### 🎯 **Quản lý công việc thông minh**

- ✅ **Task chính & Task phụ**: Tổ chức công việc theo cấu trúc phân cấp
- 🏷️ **Phân loại đa dạng**: Trạng thái (To Do, In Progress, Completed, Overdue) và độ ưu tiên (High, Medium, Low)
- 🔍 **Tìm kiếm & Lọc**: Tìm kiếm nhanh theo từ khóa, lọc theo trạng thái, độ ưu tiên
- 📅 **Quản lý deadline**: Theo dõi công việc quá hạn, sắp đến hạn, hoàn thành
- 🎊 **Hiệu ứng hoàn thành**: Hiệu ứng pháo hoa khi hoàn thành task

### 📅 **Quản lý lịch học & Lịch trình**

- 📚 **Lịch học linh hoạt**: Tạo lịch học với lặp lại theo ngày/tuần/tháng
- 🗓️ **Calendar tích hợp**: Hiển thị task và lịch học trên FullCalendar
- 🔄 **Lịch học lặp lại**: Hỗ trợ lịch học theo tuần với nhiều ngày trong tuần

### 🔔 **Thông báo & Nhắc nhở**

- ⚡ **Real-time notifications**: Nhận thông báo nhắc nhở qua Socket.IO
- 🌐 **Đa thiết bị**: Đồng bộ thông báo trên mọi thiết bị đăng nhập

### 👤 **Quản lý tài khoản**

- 🔐 **Xác thực đa dạng**: Đăng nhập Email/Password, Google, Facebook
- 👤 **Hồ sơ cá nhân**: Quản lý thông tin, thống kê công việc với biểu đồ
- 🔑 **Bảo mật**: JWT token, forgot password, email verification

### 📊 **Dashboard & Thống kê**

- 📈 **Biểu đồ trực quan**: Thống kê công việc với Chart.js (Pie chart)
- 📋 **Trang Todos**: Hiển thị công việc hôm nay, sắp đến hạn, quá hạn
- 📱 **Responsive**: Giao diện thích ứng hoàn hảo trên mọi thiết bị

## 🛠️ Công nghệ sử dụng

### **Frontend Core**

| Công nghệ                       | Phiên bản | Mô tả                           |
| ------------------------------- | --------- | ------------------------------- |
| [React](https://react.dev/)     | 19.0.0    | Thư viện UI hiện đại            |
| [Vite](https://vitejs.dev/)     | 6.3.0     | Build tool siêu nhanh           |
| [Material-UI](https://mui.com/) | 7.0.2     | Component library chuyên nghiệp |

### **State Management & Data Fetching**

| Công nghệ                                                  | Phiên bản | Mô tả                   |
| ---------------------------------------------------------- | --------- | ----------------------- |
| [@tanstack/react-query](https://tanstack.com/query/latest) | 5.75.1    | Server state management |
| [Axios](https://axios-http.com/)                           | 1.9.0     | HTTP client             |

### **UI/UX Enhancement**

| Công nghệ                                                        | Phiên bản | Mô tả                      |
| ---------------------------------------------------------------- | --------- | -------------------------- |
| [FullCalendar](https://fullcalendar.io/)                         | 6.1.17    | Calendar component mạnh mẽ |
| [Chart.js](https://www.chartjs.org/)                             | 4.4.9     | Thư viện biểu đồ           |
| [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | 1.9.3     | Hiệu ứng hoàn thành task   |
| [React Toastify](https://github.com/fkhadra/react-toastify)      | 11.0.5    | Notification system        |

### **Utilities & Tools**

| Công nghệ                                | Phiên bản | Mô tả                    |
| ---------------------------------------- | --------- | ------------------------ |
| [Day.js](https://day.js.org/)            | 1.11.13   | Thư viện xử lý thời gian |
| [Socket.io Client](https://socket.io/)   | 4.8.1     | Real-time communication  |
| [React Router](https://reactrouter.com/) | 7.5.0     | Routing                  |

## 🚀 Cài đặt & Chạy dự án

### **Yêu cầu hệ thống**

- Node.js 18+
- npm hoặc yarn
- Git

### **Cài đặt**

```bash
# Clone repository
git clone https://github.com/phandinhphu/tasksmanager-fe.git
cd tasksmanager-fe

# Cài đặt dependencies
npm install

# Tạo file môi trường
cp .env.example .env.development

# Cấu hình API endpoint trong .env.development
VITE_API_URL=http://localhost:5000/api
```

### **Scripts chạy dự án**

```bash
# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Kiểm tra code với ESLint
npm run lint

# Format code với Prettier
npm run beautiful
```

## 📁 Cấu trúc dự án

```
📦 tasksmanager-fe/
├── 📁 public/                 # Static assets
│   ├── vite.svg              # Favicon
│   ├── sitemap.xml           # SEO sitemap
│   └── google*.html          # Google verification
├── 📁 src/
│   ├── 📁 components/        # Reusable components
│   │   ├── 📁 CardTask/      # Task card component
│   │   ├── 📁 DateTimeOrTimeRangePicker/
│   │   ├── 📁 DialogConfirm/ # Confirmation dialogs
│   │   ├── 📁 LoadingDialog/ # Loading states
│   │   ├── 📁 SideMenu/      # Navigation sidebar
│   │   ├── 📁 SnackbarAlert/ # Toast notifications
│   │   └── 📁 TaskNotification/ # Real-time notifications
│   ├── 📁 contexts/          # React contexts
│   │   ├── 📁 Auth/          # Authentication context
│   │   └── 📁 StatusPriority/ # Task status/priority context
│   ├── 📁 hooks/             # Custom React hooks
│   │   ├── auth.js          # Authentication hooks
│   │   ├── tasks.js         # Task management hooks
│   │   ├── schedules.js     # Schedule management hooks
│   │   └── status-priority.js
│   ├── 📁 layouts/           # Layout components
│   │   └── 📁 DefaultLayout/ # Main app layout
│   ├── 📁 pages/             # Page components
│   │   ├── 📁 Home/          # Dashboard with calendar
│   │   ├── 📁 Todos/         # Today's tasks view
│   │   ├── 📁 Tasks/         # All tasks management
│   │   ├── 📁 TasksCompleted/ # Completed tasks
│   │   ├── 📁 TasksOverdue/  # Overdue tasks
│   │   ├── 📁 AddTask/       # Add new task
│   │   ├── 📁 AddSchedule/   # Add new schedule
│   │   ├── 📁 Schedules/     # Schedule management
│   │   ├── 📁 Profile/       # User profile & stats
│   │   ├── 📁 Login/         # Authentication pages
│   │   ├── 📁 Register/
│   │   ├── 📁 Help/          # User guide
│   │   └── 📁 About/         # About page
│   ├── 📁 routes/            # Routing configuration
│   ├── 📁 services/          # API services
│   │   ├── authServices.js  # Authentication API
│   │   ├── taskServices.js  # Task API
│   │   ├── scheduleServices.js # Schedule API
│   │   └── userServices.js  # User API
│   ├── 📁 utils/             # Utility functions
│   │   ├── constants.js     # App constants
│   │   ├── dayjsConfig.js   # Day.js configuration
│   │   ├── httpRequest.js   # Axios configuration
│   │   ├── socket.js        # Socket.io configuration
│   │   └── sortTasks.js     # Task sorting utilities
│   ├── App.jsx              # Root component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── 📄 package.json          # Dependencies & scripts
├── 📄 vite.config.js        # Vite configuration
├── 📄 eslint.config.js      # ESLint configuration
└── 📄 README.md            # Documentation
```

## 🎮 Hướng dẫn sử dụng

### **1. 🔐 Đăng nhập/Đăng ký**

- Tạo tài khoản mới hoặc đăng nhập
- Hỗ trợ đăng nhập bằng Google/Facebook
- Quên mật khẩu với email verification

### **2. 📋 Quản lý Tasks**

- **Tạo task**: Nhấn "Add Task" → Điền thông tin → Chọn loại (Main/Sub)
- **Chỉnh sửa**: Click vào task → Cập nhật thông tin
- **Hoàn thành**: Nhấn nút "Hoàn thành" → Thưởng thức hiệu ứng pháo hoa! 🎊
- **Lọc & Tìm kiếm**: Sử dụng thanh tìm kiếm và bộ lọc

### **3. 📅 Quản lý Lịch học**

- **Tạo lịch**: "Add Schedule" → Nhập môn học, chọn ngày, giờ học
- **Xem lịch**: Trang "Home" hiển thị lịch tích hợp với tasks
- **Chỉnh sửa**: Drag & drop để thay đổi thời gian

### **4. 🎯 Todos Dashboard**

- **Hôm nay**: Tasks cần làm trong ngày
- **Sắp đến hạn**: Tasks trong 3 ngày tới
- **Quá hạn**: Tasks đã quá deadline

### **5. 📊 Thống kê**

- Xem profile để thấy biểu đồ thống kê công việc
- Theo dõi hiệu suất làm việc theo thời gian

## 🎨 Screenshots

<div align="center">

### 🏠 Dashboard

_Giao diện chính với calendar tích hợp_

### 📋 Task Management

_Quản lý công việc với search & filter_

### 📅 Schedule Management

_Lên lịch học linh hoạt_

### 📊 Profile & Stats

_Thống kê cá nhân với biểu đồ_

</div>

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp!

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 👥 Đội ngũ phát triển

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/phandinhphu">
        <img src="https://avatars.githubusercontent.com/u/127222540?v=4" width="100px;" alt="Phan Đình Phú"/>
        <br />
        <sub><b>Phan Đình Phú</b></sub>
      </a>
      <br />
      <sub>Frontend Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/nguyenhuuphuoc">
        <img src="https://avatars.githubusercontent.com/u/89702898?v=4" width="100px;" alt="Nguyễn Hữu Phước"/>
        <br />
        <sub><b>Nguyễn Hữu Phước</b></sub>
      </a>
      <br />
      <sub>Backend Developer</sub>
    </td>
  </tr>
</table>

## 📞 Liên hệ

- 📧 **Frontend**: phuphandinh2004@email.com
- 📧 **Backend**: groovemusic4399@pm.me
- 🔗 **Frontend Repo**: [tasksmanager-fe](https://github.com/phandinhphu/tasksmanager-fe)
- 🔗 **Backend Repo**: [tasksmanager-be](https://github.com/phandinhphu/tasksmanager-be)

## 📄 License

Dự án này được phát hành dưới giấy phép MIT. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<div align="center">

**⭐ Nếu dự án hữu ích, hãy cho chúng tôi một star! ⭐**

_Được xây dựng với ❤️ bởi đội ngũ Tasks Manager_

</div>
