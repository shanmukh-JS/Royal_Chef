# Smart Restaurant Self-Ordering System

A production-ready QR-code scan ordering platform designed for high-end restaurants. Customers can scan table-specific QR codes, explore menu items with live search and category filtering, customize order carts, and submit orders directly. Restaurant administrators can securely authenticate via JWT, track incoming order flows, manage menu listings with local image uploads, and view analytics charts.

---

## Workspace Architecture

```
restaurant-ordering-system/
├── backend/
│   ├── config/             # Database pool connection setup
│   ├── controllers/        # Business logic for auth, menus, orders, reports
│   ├── database/           # MySQL Schema structures and Dummy Seeding records
│   ├── middleware/         # JWT validations, error catches, input validations
│   ├── routes/             # REST routing mappings
│   ├── uploads/            # Local static directory hosting menu image uploads
│   ├── app.js              # Express core configurations
│   ├── server.js           # Server entrance bootloader
│   ├── testing.js          # Node verification script
│   └── package.json        # Node modules and scripts
│
└── frontend/
    ├── public/             # Browser assets
    ├── src/
    │   ├── components/     # Reusable layout slots (Navbar, Sidebars, Footers)
    │   ├── context/        # React context states (CartContext, AuthContext)
    │   ├── pages/          # Customer pages & Administrator dashboards
    │   ├── services/       # Axios API client helper configurations
    │   ├── App.jsx         # App router maps and gateways
    │   ├── index.css       # Tailwind compilation directives & luxury theme css
    │   └── main.jsx        # Main React element mount
    ├── postcss.config.js   # Style compiler config
    ├── tailwind.config.js  # Color schemes, custom fonts, animations configurations
    └── package.json        # React client dependencies and scripts
```

---

## 🛠️ Step-by-Step Installation & Setup

### Prerequisites
- Node.js (>= v18.0.0)
- MySQL Server (running locally on port 3306)

---

### Step 1: MySQL Database Initialization

1. Start your local MySQL server.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Run the database initialization script. This creates `restaurant_db` and imports table structures along with 23+ pre-configured menu items and sample orders:
   ```bash
   npm run db:init
   ```

---

### Step 2: Backend REST Server Configuration

1. In the `backend/` directory, verify the environment settings in `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=restaurant_db
   JWT_SECRET=supersecretrestaurantjwtkey123!
   JWT_EXPIRE=24h
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:5000`):
   ```bash
   npm start
   ```

---

### Step 3: Frontend Client Configuration

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the local Vite development server:
   ```bash
   npm run dev
   ```
4. Open the browser and visit `http://localhost:5173`. To simulate a customer table scan, append the table parameter:
   `http://localhost:5173/?table=5`

---

## 🔑 Administrative Default Credentials

To access the admin panel (`http://localhost:5173/admin/login`), use:
- **Email**: `admin@restaurant.com`
- **Password**: `AdminPassword123`

---

## 📊 REST API Documentation Reference

### 🔐 Authentication
* **`POST /api/admin/login`**
  - Logs in administrator and generates JWT bearer token.
  - Body: `{ "email": "...", "password": "..." }`

### 🍳 Menu Catalog
* **`GET /api/menu`**
  - Fetches dishes list. Supports queries `?category=Starters` and `?search=Paneer`.
* **`GET /api/menu/:id`**
  - Retrieves detailed fields for a specific menu item.
* **`POST /api/menu`** (Secured)
  - Inserts new item. Accepts `multipart/form-data` with body fields (`name`, `price`, `category`, `description`, `available`) and file upload field `image`.
* **`PUT /api/menu/:id`** (Secured)
  - Overwrites existing item. Accepts `multipart/form-data`.
* **`DELETE /api/menu/:id`** (Secured)
  - Removes item (fails with 400 alert if item was previously ordered).

### 🛒 Customer Orders
* **`POST /api/orders`**
  - Placed customer cart contents. Validates inputs and server-side pricing.
  - Body: `{ "customer_name": "...", "mobile_number": "...", "table_number": "5", "items": [{ "menu_item_id": 1, "quantity": 2 }] }`
* **`GET /api/orders`** (Secured)
  - Lists historical invoices.
* **`GET /api/orders/:id`**
  - Returns itemized tracking milestones for table customers.
* **`PUT /api/orders/:id/status`** (Secured)
  - Transitions order status: `Received` -> `Preparing` -> `Ready` -> `Served`.
  - Body: `{ "status": "Preparing" }`

### 📈 Reports & Analytics
* **`GET /api/admin/dashboard/stats`** (Secured)
  - Retrieves revenue sum today, cumulated invoices, pending counts, and week-graph lists.
* **`GET /api/admin/reports/:timeframe`** (Secured)
  - `:timeframe` options: `daily` | `weekly` | `monthly`. Exposes time-series aggregations for charts.

---

## 🧪 Integration Testing Guide

We have included a programmatic end-to-end integration testing script.
1. Ensure the MySQL server is active and the Express server is running.
2. Inside `backend/` execute the script:
   ```bash
   node testing.js
   ```
This test asserts:
- Server connection health
- Rejection of invalid administrative passwords (401 response)
- Successful JWT validation & retrieval
- Blocked access to dashboard APIs without auth token (401 response)
- Authorized requests to dashboard statistics
- Transactional checkout processing
- Dynamic status transitions

---

## 🚀 Production Deployment Guide

### Backend Deployment (e.g., PM2 / Heroku / DigitalOcean)
1. Provision a production-ready MySQL instance (e.g., AWS RDS / Clever Cloud).
2. Point env variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`) to your production instance.
3. Use a process manager like **PM2** to run the backend in the background:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "restaurant-backend"
   ```
4. Set up an Nginx reverse proxy to forward traffic on port 80 to port 5000.

### Frontend Deployment (e.g., Vercel / Netlify / AWS S3)
1. Point your API client configuration in `frontend/src/services/api.js` to your hosted domain (e.g., `https://api.yourdomain.com/api`).
2. Build the production assets folder:
   ```bash
   npm run build
   ```
3. Deploy the compiled `dist/` directory statically to platforms like Vercel or Netlify. Enforce router routing fallbacks (e.g., configure `_redirects` or `vercel.json` rewrite maps to redirect all routes to `index.html`).
