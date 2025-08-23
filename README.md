# PG & Bike Rental Management System 🏠🚲

A comprehensive web application for managing PG (Paying Guest) accommodations and bike rentals with multi-role functionality.

## 🚀 Features

### For Users
- **Account Management**: Registration, login, profile management
- **PG Booking**: Browse and book PG accommodations
- **Bike Rental**: Rent bikes with flexible duration options
- **Reviews & Ratings**: Rate and review services
- **Booking History**: Track all bookings and transactions

### For Owners
- **Property Management**: Add and manage PG properties
- **Bike Fleet Management**: Manage bike inventory
- **Booking Management**: Accept/reject bookings
- **Revenue Analytics**: Track earnings and performance
- **User Management**: Manage tenant information

### For Admins
- **System Overview**: Complete system analytics
- **User Management**: Manage all users and owners
- **Content Management**: Manage system content
- **Approval Workflow**: Approve/reject owner registrations
- **Revenue Monitoring**: System-wide revenue tracking

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Nodemailer** - Email services

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Ashu6307/pg-bike-rental-system.git
cd pg-bike-rental-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# EMAIL_USER=your_email
# EMAIL_PASS=your_email_app_password
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

Update `backend/.env` with your actual values:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Secret (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Server
PORT=5000
NODE_ENV=development

# Email (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 5. Run the Application

**Start Backend Server:**
```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

**Start Frontend (in new terminal):**
```bash
cd frontend
npm start
# React app will run on http://localhost:3000
```

## 📁 Project Structure

```
pg-bike-rental-system/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS files
│   └── public/             # Static files
├── backend/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── uploads/           # File uploads
└── README.md
```

## 🔐 Default Admin Access

After running the admin seeder, use these credentials:
- **Email**: admin@admin.com
- **Password**: admin123

## 📧 Email Configuration

For email functionality (OTP, notifications):

1. Enable 2-factor authentication in your Gmail account
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS` environment variable

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## 👥 Team Collaboration Guidelines

### For New Team Members:

1. **Clone the repo** and follow setup instructions above
2. **Create a new branch** for your feature: `git checkout -b feature/your-feature-name`
3. **Make your changes** and test locally
4. **Commit frequently** with clear messages
5. **Push your branch** and create a Pull Request
6. **Request code review** before merging

### Development Workflow:

```bash
# Get latest changes
git pull origin main

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature description"

# Push your branch
git push origin feature/new-feature

# Create Pull Request on GitHub
```

## 🐛 Common Issues & Solutions

### Backend won't start:
- Check if MongoDB is running
- Verify `.env` file configuration
- Ensure all dependencies are installed: `npm install`

### Frontend won't start:
- Clear node modules: `rm -rf node_modules && npm install`
- Check if backend is running on port 5000

### Database connection issues:
- Verify MongoDB URI in `.env`
- Check network connectivity
- Ensure database user has proper permissions

## 📞 Support

If you encounter any issues or need help:

1. Check existing [Issues](https://github.com/Ashu6307/pg-bike-rental-system/issues)
2. Create a new issue with detailed description
3. Contact the team lead

## 📄 License

This project is developed for educational/commercial purposes.

---

**Happy Coding! 🚀**
