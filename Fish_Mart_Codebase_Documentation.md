# Fish Mart — Complete Application Codebase & Function Documentation

*Detailed Technical Architecture, Code File Explanations, State Management, and Function Guide*

---

## 1. Executive Overview & Technology Architecture

**Fish Mart** is an enterprise-grade E-Commerce web application built for fresh seafood and coastline fish delivery. The system incorporates authentic seafood shopping features including direct coastline catch sourcing, custom cutting options (*Steak Cut*, *Curry Cut*, *Boneless Cubes*, *Cleaned & Deveined*), net vs gross weight pricing, delivery location selection powered by Google Maps API, a multi-tab Payment Gateway, and a dual-role architectural model featuring two distinct visual design systems:

- **Customer Storefront (Blue Ocean Theme)**:
  - Deep marine navy palette (`#070F1E`), electric cyan accents (`#06B6D4`), auto-playing right-to-left sliding hero banner carousel, search & price sorting, category filter pills, login-gated interactive cart drawer, multi-tab payment gateway (UPI/QR, Card graphic preview, Net Banking, COD), and 90-minute live order tracking.
- **Admin Control Portal (Sunset Theme)**:
  - Warm sunset orange palette (`#F97316`), amber highlights (`#F59E0B`), complete Read/Write product CRUD management, image picture URL live preview modal, stock modifiers (`+5` / `-5`), customer order status manager, and Google Maps fulfillment hub detector.

### Core Technology Stack

| Layer / Component | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite, TypeScript, Tailwind CSS, React Router v6 |
| **Backend Framework** | Node.js, Express.js, TypeScript, ts-node-dev |
| **Database & Fallback** | MongoDB, Mongoose ORM, MongoMemoryServer (In-memory fallback) |
| **Authentication & Security** | JSON Web Tokens (JWT), bcrypt password hashing, Role-Based Authorization |
| **Maps & External APIs** | Google Maps iframe location embed, Geolocation API |

---

## 2. Backend Architecture & Server Files (`server/src`)

### `server/src/server.ts` — Express Server Initialization
**Purpose**: Main entry point for the Node.js Express backend server.
- **Express App Configuration**: Configures middleware including `cors()` for cross-origin requests and `express.json()` for JSON body parsing.
- **Route Listener Registration**: Registers `/api/auth`, `/api/products`, `/api/orders`, and `/api/admin/products` endpoints.
- **Database Connection Trigger**: Invokes `connectDB()` and triggers `seedInitialData()` on startup to ensure catalog items exist.

### `server/src/config/db.ts` — Database Connection Manager
**Purpose**: Handles database connection with automated zero-downtime in-memory fallback.
- **Dual Connection Strategy**: Tries connecting to local MongoDB at `mongodb://localhost:27017/fishmart`. If local MongoDB is unavailable, automatically initializes an in-memory `MongoMemoryServer` instance.

### `server/src/seed.ts` — Initial Data Seeder
**Purpose**: Seeds authentic Licious-style seafood products and default system users.
- **Seafood Catalog**: Populates 13 authentic seafood products with categories (*Sea Fish*, *Freshwater Fish*, *Prawns & Shrimps*, *Crabs & Shellfish*, *Ready to Cook*, *Combo Packs*), net/gross weights, cutting options, stock levels, and badges.
- **Default Users**: Creates default Admin (`admin@fishmart.test` / `Admin123!`) and Customer (`customer@fishmart.test` / `Customer123!`) accounts with bcrypt password hashes.

### `server/src/models/` — Mongoose Schemas
- **`Product.ts`**: Defines schema for seafood products including `name`, `description`, `category`, `images` array, `weights` array (`{ label, price }`), `cuttingOptions` array, `stock`, `badge`, `netWeight`, `grossWeight`, `rating`, and `reviewsCount`.
- **`User.ts`**: Defines schema for user authentication with `name`, `email` (unique), `password` hash, and `role` (`'CUSTOMER'` \| `'ADMIN'` \| `'DELIVERY_PARTNER'`).
- **`Order.ts`**: Defines schema for customer orders containing item details, delivery address, delivery slot, `paymentMethod` (`'UPI'` \| `'CARD'` \| `'NETBANKING'` \| `'COD'`), `orderStatus` (`'PLACED'` \| `'CONFIRMED'` \| `'PREPARING'` \| `'OUT_FOR_DELIVERY'` \| `'DELIVERED'` \| `'CANCELLED'`), subtotal, tax, and total.

### `server/src/controllers/` — Request Handlers
- **`authController.ts`**: Handlers for `register()` to create accounts and `login()` to verify credentials and issue JWT bearer tokens.
- **`productsController.ts`**: Handlers for `getProducts()` (with optional category filtering) and `getProductById()`.
- **`adminProductController.ts`**: Admin-restricted handlers including `createProduct()`, `updateProduct()`, and `deleteProduct()`.
- **`ordersController.ts`**: Handlers for `createOrder()`, `getUserOrders()`, and `updateOrderStatus()`.

### `server/src/middleware/` — Security Middlewares
- **`auth.ts` (`authenticate`)**: Validates incoming `Authorization: Bearer <token>` headers and attaches decoded user context to `req.user`.
- **`roles.ts` (`authorizeRoles`)**: Restricts route access to specified roles (`'ADMIN'`). Returns 403 Forbidden if user lacks authorization.

---

## 3. Frontend Architecture & React Files (`client/src`)

### `client/src/components/Navbar.tsx` — Navigation Header
**Purpose**: Sticky top navigation bar supporting dual-role states and clean auth layouts.
- **Route-Aware Minimal Header**: On `/login` and `/register` pages, renders only the `BrandLogo` and a clean Sign In / Register link (*"just app and signin is enough"*).
- **Changeable Location Trigger**: Displays current delivery area (`📍 Delivering to: T. Nagar, Chennai`) and opens `LocationModal` on click.
- **Login-Gated Cart Badge**: Displays Cart icon with live item counter badge ONLY when user is authenticated.
- **Role-Aware Navigation**: Renders `👑 Admin Hub` button when logged in as ADMIN.

### `client/src/components/BrandLogo.tsx` — Brand Logo Component
**Purpose**: Distinctive application logo and brand typography.
- **Image Rendering**: Displays exact brand logo image with background contrast glassmorphic pill and cyan drop-shadow filter.
- **Fallback Badge & Typography**: Includes `onError` fallback state rendering a high-visibility badge paired with Righteous / Syne Google Font typography (`FISH MART`).

### `client/src/components/LocationModal.tsx` — Google Maps Location Picker
**Purpose**: Interactive delivery location modal.
- **Google Maps Embed**: Embedded iframe preview (`https://maps.google.com/maps?q=lat,lng&output=embed`) showing latitude/longitude pin.
- **GPS Auto-Detection**: One-click button utilizing browser `navigator.geolocation` to detect current coordinates.
- **Preset Area Pills**: Quick-select pills for popular Chennai delivery hubs (*T. Nagar*, *Velachery*, *Anna Nagar*, *Adyar*, *Besant Nagar*, *OMR*).

### `client/src/components/CartDrawer.tsx` — Slide-Over Cart Drawer
**Purpose**: Interactive slide-over cart drawer.
- **Quantity Controls**: Adjust item quantities (`+`) / (`-`), remove items, select cut preferences (*Steak Cut*, *Curry Cut*, *Boneless Cubes*), and view weight variants.
- **Promo Coupons**: Apply coupon codes `OCEAN100` (₹100 off) or `FRESH50` (₹50 off).
- **Live Totals Breakdown**: Displays Subtotal, 5% Tax/Packing, Delivery Fee (Free above ₹499), and Total Payable with a direct Checkout CTA.

### `client/src/pages/Home.tsx` — Customer Storefront Page
**Purpose**: Main customer landing and product catalog page.
- **Sliding Banner Carousel**: Auto-playing 4-second right-to-left sliding hero banner showcasing fresh catch updates, jumbo prawns, and weekend promotions with slide indicator dots and arrow controls.
- **Search & Sort Toolbar**: Search input for fish names and price sorting dropdown (*Featured*, *Price: Low to High*, *Price: High to Low*, *Rating*).
- **Category Filter Pills**: Filter products by *Sea Fish*, *Freshwater Fish*, *Prawns*, *Crabs*, *Ready to Cook*, and *Combo Packs*.
- **Product Cards**: Displays net vs gross weights, cut selectors, weight dropdowns, stock status, ratings, and Add to Cart handlers.

### `client/src/pages/AdminDashboard.tsx` — Sunset Theme Admin Control Hub
**Purpose**: Sunset Theme Admin Portal for complete inventory & order management.
- **Product Inventory Table (Read / Write)**: List all products with thumbnail images, prices, categories, stock controls (`-5` / `+5` buttons), edit modal triggers, and delete buttons.
- **Add / Edit Product Modal**: Form to configure product name, category, price, stock, weight specs, cut preferences, and Image Picture URL with live picture preview.
- **Customer Orders Manager**: View customer orders and update status dropdowns (`PLACED` → `CONFIRMED` → `PREPARING` → `OUT_FOR_DELIVERY` → `DELIVERED` → `CANCELLED`).
- **Google Maps Hub Detector**: Interactive map showing central fulfillment hub coordinates and coverage area.

### `client/src/pages/Checkout.tsx` — Payment Gateway & Order Page
**Purpose**: Complete checkout interface supporting 4 secure payment gateways.
- **Address & Slot Selection**: Confirm recipient name, phone, delivery pin, and delivery time slot (*ASAP 90 Mins*, *Evening*, *Tomorrow*).
- **Payment Tabs**: 1) **UPI / QR Code** (scan QR code / VPA ID), 2) **Credit / Debit Card** (interactive live card graphic preview with card number, expiry, CVV), 3) **Net Banking** (HDFC, ICICI, SBI, Axis, Kotak), 4) **Cash on Delivery**.
- **Simulated Payment Verification**: Multi-stage loader overlay simulating 3D secure gateway authorization steps before finalizing order.

### `client/src/pages/OrderSuccess.tsx` — Order Confirmation & Live Tracker
**Purpose**: Order confirmation receipt page.
- **Celebration Card**: Order reference number (`FM...`) and payment confirmation badge.
- **Live 4-Stage Tracker**: Visual progress timeline (1. Placed → 2. Confirmed → 3. Out for Delivery → 4. Delivered) with 90-minute ETA timer.
- **Order Summary**: Itemized receipt breakdown and delivery address confirmation.

### `client/src/pages/Login.tsx` & `Register.tsx` — Role Authentication Pages
**Purpose**: User login and registration with explicit Role Selection.
- **Role Selector Bar**: Toggle between `👤 Customer` and `👑 Admin Portal` before logging in.
- **Role-Based Redirects**: Logging in as Admin redirects directly to `/admin` (Sunset Theme Portal), while logging in as Customer redirects to `/` (Customer Storefront).

---

## 4. Standalone Admin Helper Service (`client/src/services/adminService.ts`)

```typescript
import api from './api'

/**
 * Adjust or update product stock quantity
 */
export const updateProductStock = async (productId: string, newStock: number) => {
  const res = await api.put(`/admin/products/${productId}`, { stock: newStock })
  return res.data
}

/**
 * Update the delivery & processing status of a customer order
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await api.put(`/orders/${orderId}/status`, { status })
  return res.data
}

/**
 * Delete a product from inventory
 */
export const deleteAdminProduct = async (productId: string) => {
  const res = await api.delete(`/admin/products/${productId}`)
  return res.data
}

/**
 * Create a new product in the catalog
 */
export const createAdminProduct = async (payload: any) => {
  const res = await api.post('/admin/products', payload)
  return res.data
}

/**
 * Edit existing product details
 */
export const editAdminProduct = async (productId: string, payload: any) => {
  const res = await api.put(`/admin/products/${productId}`, payload)
  return res.data
}
```
