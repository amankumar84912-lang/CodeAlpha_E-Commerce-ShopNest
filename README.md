# 🛍️ ShopNest — Full-Stack MERN Ecommerce Platform

<div align="center">

![ShopNest](https://img.shields.io/badge/ShopNest-Ecommerce-6366f1?style=for-the-badge&logo=shopify&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white)

**A production-grade ecommerce platform with real payment processing, Cloudinary image uploads, and a professional admin dashboard.**

[Live Demo](#) · [API Docs](#api-overview) · [Report Bug](issues)

</div>

---

## ✨ Features

### 🛒 Shopping Experience
- **Product catalog** with search, category filters, and sort options
- **Debounced search** — filters update 300ms after typing stops
- **Skeleton loaders** — no layout shift while products load
- **Product detail pages** with ratings, stock status, and add-to-cart
- **Persistent cart** — cart syncs to MongoDB, survives page refresh

### 💳 Checkout & Payments
- **Razorpay payment integration** — real test/live payment gateway
- **Multi-step checkout** — shipping → review → Razorpay modal → confirmation
- **HMAC signature verification** — server-side payment security
- **Free shipping** above ₹500 threshold

### 👤 User System
- **JWT authentication** — register, login, session management
- **Editable profile** — update name, email, password
- **Order history** — view all past orders with status and payment info
- **Auto-logout** on expired tokens with session-expired banner

### 🔧 Admin Dashboard
- **Product management** — create, edit, delete with live preview
- **Cloudinary image upload** — drag-and-drop or URL, stored on CDN
- **Low stock alerts** — dashboard shows products ≤5 units
- **Category analytics** — visual category breakdown with bar chart
- **Product search** in admin table

### 🔐 Security
- `helmet` — HTTP security headers
- `express-rate-limit` — brute force protection (100 req/15min general, 20 auth)
- JWT with strong secret, `httpOnly` storage pattern
- CORS whitelist — only approved origins
- Graceful shutdown on SIGTERM/SIGINT (Render-compatible)

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, React Router DOM 7 |
| **State** | Context API (Auth, Cart, Toast) |
| **HTTP Client** | Axios with JWT interceptors |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB Atlas + Mongoose 9 |
| **Auth** | JWT + bcryptjs |
| **Payments** | Razorpay (India payment gateway) |
| **File Storage** | Cloudinary + Multer |
| **Security** | Helmet, express-rate-limit |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Folder Structure

```
CodeAlpha_EcommerceStore/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── product/       # ProductCard, StarRating
│   │   │   ├── routing/       # ProtectedRoute, AdminRoute, GuestRoute
│   │   │   └── ui/            # Spinner, Toast, SkeletonCard, PageLoader
│   │   ├── context/           # AuthContext, CartContext, ToastContext
│   │   ├── hooks/             # useDebounce
│   │   ├── pages/             # All page components
│   │   ├── services/          # API service functions (api.js, cartService.js, etc.)
│   │   └── App.jsx            # Router + lazy loading
│   ├── .env                   # Development env (localhost)
│   ├── .env.production        # Production env (Vercel → Render)
│   └── vercel.json            # SPA routing + asset caching
│
└── server/                    # Node/Express backend
    ├── controllers/           # Business logic per feature
    ├── middleware/             # auth, error, upload
    ├── models/                # Mongoose schemas (User, Product, Cart, Order)
    ├── routes/                # Express route definitions
    ├── utils/                 # asyncHandler, razorpay, cloudinary singletons
    ├── seeder.js              # Demo data seed script
    └── server.js              # App entry point
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Razorpay test account
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/shopnest.git
cd shopnest
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/shopnest
JWT_SECRET=your_super_strong_jwt_secret_min_32_chars
CLIENT_URL=http://localhost:5173

# Razorpay (get from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXX

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev        # Start development server (nodemon)
npm run seed       # Seed 20 demo products
```

### 3. Frontend setup
```bash
cd ../client
npm install
```

`client/.env` is already configured for localhost. Just run:
```bash
npm run dev        # http://localhost:5173
```

### 4. Create admin account
Register a user, then in MongoDB Atlas set `"isAdmin": true` on their document.

---

## 🌐 Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Root directory: `server`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from `server/.env`
7. Note your Render URL: `https://shopnest-api.onrender.com`

### Frontend → Vercel

1. Create a new project on [vercel.com](https://vercel.com)
2. Root directory: `client`
3. Framework: Vite
4. Add environment variable:
   - `VITE_API_URL` = `https://shopnest-api.onrender.com/api`
5. Deploy — SPA routing is handled by `vercel.json`

### Post-deployment
- Update `CLIENT_URL` on Render to your Vercel URL
- Whitelist `0.0.0.0/0` in MongoDB Atlas → Network Access

---

## 📡 API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/products` | — | Get all products (search/filter/sort) |
| GET | `/api/products/:id` | — | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| GET | `/api/cart` | User | Get user's cart |
| POST | `/api/cart` | User | Add item to cart |
| PUT | `/api/cart/:productId` | User | Update item quantity |
| DELETE | `/api/cart/:productId` | User | Remove item |
| DELETE | `/api/cart` | User | Clear cart |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders` | User | Get my orders |
| POST | `/api/payment/create-order` | User | Create Razorpay order |
| POST | `/api/payment/verify` | User | Verify payment HMAC |
| POST | `/api/upload` | Admin | Upload image to Cloudinary |
| GET | `/api/health` | — | Health check |

---

## 🔐 Environment Variables Reference

### Server (`server/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Min 32-char random string |
| `CLIENT_URL` | Frontend URL for CORS |
| `RAZORPAY_KEY_ID` | From Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | From Razorpay dashboard |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Client (`client/.env.production`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_APP_NAME` | App display name |
| `VITE_ENVIRONMENT` | `production` |

---

## 📸 Screenshots

> _Add screenshots here after deployment_

| Page | Description |
|---|---|
| Homepage | Hero banner, featured products |
| Products | Search, filter, sort, skeleton loaders |
| Product Detail | Gallery, ratings, add to cart |
| Cart | Item management, order summary |
| Checkout | Multi-step form + Razorpay |
| Orders | Order history with status |
| Admin Dashboard | Product management, analytics |

---

## 👨‍💻 Author

Built as a production-grade portfolio project demonstrating full-stack MERN development with real payment integration, cloud storage, and deployment infrastructure.

---

## 📄 License

MIT
