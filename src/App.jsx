import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProductCategory from "./pages/admin/AdminProductCategory"
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";

const auth = (el) => <ProtectedRoute>{el}</ProtectedRoute>;
const admin = (el) => <ProtectedRoute adminOnly>{el}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/profile" element={auth(<Profile />)} />
      <Route path="/cart" element={auth(<Cart />)} />
      <Route path="/checkout" element={auth(<Checkout />)} />
      <Route path="/confirmation/:id" element={auth(<Confirmation />)} />
      <Route path="/orders" element={auth(<Orders />)} />

      {/* Public admin pages */}
      <Route path="*" element={<NotFound />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/productcategory" element={<AdminProductCategory />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
    </Routes>
  );
}
