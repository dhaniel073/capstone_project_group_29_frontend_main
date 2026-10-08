import { Routes, Route } from "react-router";
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
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={admin(<AdminDashboard />)} />
      <Route path="/admin/products" element={admin(<AdminProducts />)} />
      <Route path="/admin/productcategory" element={admin(<AdminProductCategory />)} />
      <Route path="/admin/orders" element={admin(<AdminOrders />)} />
    </Routes>
  );
}
