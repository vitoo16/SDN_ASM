# MERN Stack Perfume Management System

A comprehensive perfume e-commerce platform built with MongoDB, Express.js, React, and Node.js, featuring authentication, authorization, and full CRUD operations.

## 🚀 Features

### Assignment Requirements Completed

#### Task 1 - Public Routes & Member Features
- ✅ Index route displaying all perfumes with name, image, targetAudience, and brandName
- ✅ Detailed perfume information pages
- ✅ Search perfumes by name
- ✅ Filter perfumes by brand name and other criteria
- ✅ Member registration (default non-admin role)
- ✅ Member login with JWT authentication
- ✅ Member profile editing (self-only restriction)
- ✅ Password change functionality
- ✅ Member feedback and rating system (one per perfume)
- ✅ Outstanding design for Extrait concentration with animations

#### Task 2 - Admin Authorization
- ✅ Admin-only access to GET, POST, PUT, DELETE operations on `/brands` and `/brands/:brandId`
- ✅ Admin-only access to GET, POST, PUT, DELETE operations on `/perfumes` and `/perfumes/:perfumeId`
- ✅ JWT-based role verification middleware

#### Task 3 - Feedback System
- ✅ Comment and rating functionality for members
- ✅ One comment per perfume per member restriction
- ✅ Members can manage their own feedback

#### Task 4 - Collections Endpoint
- ✅ Admin-only `/collectors` endpoint returning all members
- ✅ Proper access control preventing ordinary members from this operation

### Additional Features
- 🔐 JWT-based authentication with token refresh
- 🌐 **Google OAuth 2.0 Integration** - Sign in with Google (NEW!)
- 👤 Role-based access control (Admin/Member)
- 🛡️ Password hashing with bcrypt
- 📱 Responsive Material-UI design
- 🔍 Advanced search and filtering
- 📄 Pagination support
- ⚡ Real-time form validation
- 🎨 Beautiful UI with hover effects and animations

## 🏗️ Architecture

```
├── backend/                 # Node.js/Express API
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & validation
│   └── server.js          # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── context/       # React context
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
└── package.json
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## ⚡ Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd SDN_ASM
npm install
cd frontend && npm install
cd ..
```

### 2. Environment Setup

Create `.env` file in the root directory (or copy from `env.template`):

```env
MONGODB_URI=mongodb://localhost:27017/perfume_db
JWT_SECRET=your-very-secret-jwt-key-here-make-it-long-and-secure
JWT_EXPIRES_IN=30d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
SESSION_SECRET=your-session-secret-key

# Google OAuth 2.0 (Optional - for Google Sign In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

**For Google OAuth Setup**: See [QUICK_START_GOOGLE_OAUTH.md](./QUICK_START_GOOGLE_OAUTH.md)

**Generate secure secrets**:
```bash
npm run generate-secrets
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Database Setup

Seed the database with sample data:

```bash
node seed.js
```

This creates:
- **Admin User**: admin@myteam.com / admin123
- **Regular User**: user@example.com / user123
- Sample brands and perfumes

### 4. Start the Application

**Backend** (Terminal 1):
```bash
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 API Endpoints

### Authentication
- `POST /api/members/register` - Register new member
- `POST /api/members/login` - Login member
- `GET /auth/google` - Initiate Google OAuth (NEW!)
- `GET /auth/google/callback` - Google OAuth callback (NEW!)

### Members
- `GET /api/members/profile` - Get current user profile (Protected)
- `PUT /api/members/:id` - Update member profile (Self or Admin)
- `PUT /api/members/:id/password` - Change password (Self or Admin)
- `GET /api/members/collectors` - Get all members (Admin only)

### Brands
- `GET /api/brands` - Get all brands (Public)
- `GET /api/brands/:brandId` - Get brand by ID (Public)
- `POST /api/brands` - Create brand (Admin only)
- `PUT /api/brands/:brandId` - Update brand (Admin only)
- `DELETE /api/brands/:brandId` - Delete brand (Admin only)

### Perfumes
- `GET /api/perfumes` - Get all perfumes with filtering (Public)
- `GET /api/perfumes/:perfumeId` - Get perfume details (Public)
- `POST /api/perfumes` - Create perfume (Admin only)
- `PUT /api/perfumes/:perfumeId` - Update perfume (Admin only)
- `DELETE /api/perfumes/:perfumeId` - Delete perfume (Admin only)

### Comments
- `POST /api/perfumes/:perfumeId/comments` - Add comment (Members only)
- `PUT /api/perfumes/:perfumeId/comments/:commentId` - Update own comment
- `DELETE /api/perfumes/:perfumeId/comments/:commentId` - Delete own comment

## 🗄️ Database Schema

### Member Schema
```javascript
{
  email: String (unique, required),
  password: String (hashed, required for local auth), 
  name: String (required),
  YOB: Number (required for local auth),
  gender: Boolean (required for local auth), // true = male, false = female
  isAdmin: Boolean (default: false),
  provider: String (enum: ['local', 'google'], default: 'local'), // NEW!
  googleId: String (unique, sparse), // NEW!
  avatar: String // Google profile picture URL (NEW!)
}
```

### Brand Schema
```javascript
{
  brandName: String (unique, required)
}
```

### Perfume Schema
```javascript
{
  perfumeName: String (required),
  uri: String (required), // image URL
  price: Number (required),
  concentration: String (Extrait|EDP|EDT|EDC),
  description: String (required),
  ingredients: String (required),
  volume: Number (required),
  targetAudience: String (male|female|unisex),
  comments: [CommentSchema],
  brand: ObjectId (ref: Brands)
}
```

### Comment Schema
```javascript
{
  rating: Number (1-5, required),
  content: String (required),
  author: ObjectId (ref: Members)
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **OAuth 2.0**: Google Sign In integration (NEW!)
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access**: Admin/Member permissions
- **Self-Access Control**: Members can only edit their own data
- **Input Validation**: Server-side validation with express-validator
- **CORS Configuration**: Proper cross-origin request handling
- **Session Management**: Secure session storage with MongoDB

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Material-UI Components**: Modern, accessible interface
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Search & Filter**: Real-time search with multiple filters
- **Animations**: Hover effects and Extrait concentration highlights
- **Form Validation**: Real-time client-side validation

## 🧪 Testing

Test the application with the seeded data:

1. **Public Access**: Browse perfumes without login
2. **Member Registration**: Create new account
3. **Member Login**: Login with user@example.com / user123
4. **Admin Login**: Login with admin@myteam.com / admin123
5. **Admin Features**: Create/edit brands and perfumes (admin only)
6. **Comments**: Add ratings and comments to perfumes (members only)
7. **Profile Management**: Edit your own profile information

## 🚦 Assignment Compliance

### ✅ All Requirements Met

1. **Member Schema**: Implemented with email, password (hashed), name, YOB, gender, isAdmin
2. **Database Collections**: All schemas implemented as specified
3. **Login Implementation**: JWT-based authentication
4. **Mongoose Population**: Brand information populated in perfume documents
5. **Admin Verification**: Proper admin privilege checking
6. **Public Routes**: GET operations available to all users
7. **Admin Routes**: Protected POST, PUT, DELETE operations
8. **Member Restrictions**: Self-editing only, no cross-member access
9. **Comment System**: One comment per perfume per member
10. **UI Implementation**: Complete frontend with all features

### 🎯 Outstanding Features

- **Extrait Concentration**: Special highlighting with pulse animation
- **Advanced Filtering**: Multiple filter options
- **Responsive Design**: Mobile-first approach
- **Real-time Search**: Debounced search functionality
- **Error Handling**: Comprehensive error management

## 🔧 Technology Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT for authentication
- Passport.js with Google OAuth 2.0 (NEW!)
- bcrypt for password hashing
- express-validator for validation
- express-session with MongoStore

**Frontend:**
- React 18 with TypeScript
- Material-UI (MUI) v5
- React Router v6
- React Hook Form with Yup validation
- Axios for API calls

## 📚 Additional Documentation

- **[QUICK_START_GOOGLE_OAUTH.md](./QUICK_START_GOOGLE_OAUTH.md)** - Setup Google OAuth in 5 minutes
- **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)** - Detailed Google OAuth guide
- **[CHANGELOG_GOOGLE_OAUTH.md](./CHANGELOG_GOOGLE_OAUTH.md)** - Complete changelog for OAuth integration
- **[env.template](./env.template)** - Environment variables template

## 🆕 What's New

### October 20, 2025 - Google OAuth 2.0 Integration
- ✅ Sign in with Google button
- ✅ Automatic account creation/linking
- ✅ Google profile picture support
- ✅ Passport.js integration
- ✅ Backward compatible with existing accounts

## 📝 License

This project is created for educational purposes as part of the SDN assignment.

---

**Author**: [Your Name]  
**Course**: Software Development with .NET  
**Assignment**: MERN Stack Implementation