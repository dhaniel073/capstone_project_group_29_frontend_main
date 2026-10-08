# Supermarket Frontend (React 19 + Vite 8)

## Quick start
```
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # http://localhost:5173
```
Your Express backend must be running, with CORS allowing http://localhost:5173.

## Responsive breakpoints (src/styles/theme.css, mobile-first)
| Width | Behaviour |
|---|---|
| < 480px | 2-column product grid, everything stacked |
| 768px+ | Navbar links inline (hamburger hidden); auth pages side-by-side; Cart/Checkout/Product Details two-column |
| 1024px+ | Admin sidebar becomes fixed left rail; content capped at 1200px |

Also included: 44px touch targets, 16px inputs (no iOS zoom), side-scrolling admin tables.
Test with browser DevTools device mode (e.g. 375px iPhone SE) and a real phone.

## API calls (real axios calls, not mocks)
| File | Backend routes |
|---|---|
| authService.js | POST /auth/register, POST /auth/login, GET /auth/me |
| productService.js | GET/POST/PUT/DELETE /products |
| categoryService.js | GET/POST /categories |
| cartService.js | GET/POST/DELETE /cart |
| orderService.js | POST /checkout, GET /orders, GET /orders/:id, GET /orders/admin/all, PUT /orders/admin/:id/status |

Not yet on the backend: /auth/forgot-password and /auth/reset-password.

## Admin products: full CRUD
Create ("+ Add Product"), Edit (pre-filled modal, PUT), Delete (with confirm).

## Pinned dependencies
react/react-dom ^19.3.0, react-router ^8.4.0, vite ^8.3.1, axios 1.20.0 (exact pin, see axios supply-chain advisory).
