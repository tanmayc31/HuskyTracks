# 🚀 HuskyTracks: Lost & Found Management System

A comprehensive lost and found management system for Northeastern University, allowing students to report lost items, track their status, and helping supervisors efficiently manage the lost items at different campus locations.

![HuskyTracks Screenshot](./huskytracks-client/src/assets/HuskyTracks-Home.png)

## ✨ Features

### 🗺️ Interactive Map System
* **Leaflet Integration**: Built on Leaflet.js for responsive campus mapping
* **Category-Based Icons**: Custom icons for different item categories (Electronics, Books, Clothing, etc.)
* **Status Indicators**: Color-coded markers showing item status (Pending, Matched, Returned)
* **Interactive Markers**: Click to view full item details in a popup
* **Auto-Zoom**: Automatically zooms to selected items for better visibility
* **Fallback Locations**: Places items near campus landmarks when exact coordinates unavailable

<!-- <img width="800" alt="HuskyTracks Dashboard" src="https://github.com/user-attachments/assets/placeholder-image.png" /> -->

### 👤 Role-Based Access 
* Separate interfaces for students, supervisors, and administrators
* Customized dashboards for each user type

<!-- <img width="800" alt="HuskyTracks Dashboard" src="https://github.com/user-attachments/assets/placeholder-image.png" /> -->

### 📱 Student Dashboard
* **Item Management**: View, filter, and sort lost items by category, status, and date
* **Category Filtering**: Filter items by categories (Electronics, Clothing, Books, etc.)
* **Status Tabs**: Quick tabs for All Items, Active (Matched), and Resolved items
* **Item Selection**: Select items to highlight them on the map
* **Item Reports**: Detailed form for reporting lost items with location picker

<!-- <img width="800" alt="HuskyTracks Dashboard" src="https://github.com/user-attachments/assets/placeholder-image.png" /> -->

### 👥 Supervisor Dashboard
* Location-specific item management
* Status update capabilities
* Transfer options for misplaced items

<!-- <img width="800" alt="HuskyTracks Dashboard" src="https://github.com/user-attachments/assets/placeholder-image.png" /> -->

### 👑 Admin Features
* **User Management**: Create and manage system users
* **Analytics Dashboard**: Comprehensive statistics and trends
* **System-wide Oversight**: Monitor all items across campus

<!-- <img width="800" alt="HuskyTracks Dashboard" src="https://github.com/user-attachments/assets/placeholder-image.png" /> -->

## 🛠️ Technologies Used

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-0081CB?style=flat&logo=material-ui&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chart.js&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-FF6C37?style=flat&logo=node.js&logoColor=white)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

### Version Control
![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js (v14+)
* npm or yarn
* MongoDB (local or Atlas)

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/priyank-neu/HuskyTracks.git
cd HuskyTracks

# Install server dependencies
cd huskytracks-server
npm install

# Install client dependencies
cd ../huskytracks-client
npm install
```

### ⚙️ Configure Environment Variables

Create a `.env` file in the `huskytracks-server` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001
```

### ▶️ Start the Development Servers

```bash
# Start the backend server
cd huskytracks-server
npm start

# In a new terminal, start the frontend client
cd huskytracks-client
npm run dev
```

Access the application at http://localhost:5173

## 📁 Project Structure

```
HuskyTracks/
├── huskytracks-client/       # Frontend React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── assets/           # Images and static assets
│   │   ├── components/       # Reusable components
│   │   │   ├── admin/        # Admin-specific components
│   │   │   └── common/       # Shared components
│   │   ├── pages/            # Main application pages
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Application entry point
│   └── package.json          # Frontend dependencies
│
├── huskytracks-server/       # Backend Node.js/Express API
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   ├── uploads/              # Storage for uploaded images
│   ├── server.js             # Server entry point
│   └── package.json          # Backend dependencies
│
└── README.md                 # Project documentation
```

## 💻 Technical Highlights

### 🗺️ Map Marker Optimization

- Custom Icon System: Dynamically maps item categories to specialized icons
- Smart Icon Selection: Fallback logic to select appropriate icons
- Status Rings: Color-coded rings around markers indicate item status
- Popup Information: Detailed item information in marker popups
- Marker Clustering: Prevents overlapping markers in densely populated areas

### ⚡ Performance Optimizations

- Efficient Rendering: Uses React.memo and useCallback
- Dynamic Loading: Loads map tiles on demand for faster initial loading
- Debounced Search: Efficient searching without performance impact
- Map Recalculation: Forces map recalculation when container becomes visible

### 🔐 Role-Based Authorization

- Route protection based on user role
- Auto-redirection post login
- Secure API access with JWT tokens

### 🖼️ Image Management

- Upload and storage of item images
- Default placeholders for items without images
- Image optimization for faster loading

### 📊 Backend System

- MongoDB Integration: Flexible document-based storage for lost item data
- Express API: RESTful API for CRUD operations
- Coordinate Validation: Ensures proper geographic coordinates
- Image Upload: Support for item images with automatic storage
- Status Tracking: Tracks item status throughout the recovery process

## 📈 Future Enhancements

- Real-time notifications when items are matched
- Mobile app version
- Integration with university ID system
- AI-assisted matching system
- QR code generation for faster item claiming
- Email notifications for status updates

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repo, make changes, and submit a Pull Request.

## ✍️ Authors

- Tanmay Chandan
- Priyank Bagad
- Vinay Pawar

---

Give a ⭐️ if you like the project!