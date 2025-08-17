import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';
import BrandList from './components/BrandList';
import BrandForm from './components/BrandForm';
import ContactPage from './pages/ContactPage';
import ContactList from './components/ContactsList';
import { jwtDecode } from 'jwt-decode';

// Component để bảo vệ các route yêu cầu quyền truy cập
const ProtectedRoute = ({ element: Element, roleRequired, ...rest }) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  if (!token) {
    // Nếu không có token, điều hướng đến trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  const decodedToken = jwtDecode(token); // Giải mã token
  const role = decodedToken.role; // Lấy vai trò từ token

  if (role !== roleRequired) {
    // Nếu vai trò không khớp với yêu cầu, điều hướng về trang chính
    return <Navigate to="/" replace />;
  }

  return <Element {...rest} />; // Trả về component nếu tất cả điều kiện đều thỏa mãn
 
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />{/* Trang chủ của ứng dụng */}
        <Route path="/product/:id" element={<ProductDetail />} />{/* Trang chi tiết sản phẩm, hiển thị thông tin chi tiết của một sản phẩm dựa vào `id` */}
        <Route path="/cart" element={<Cart />} />{/* Trang giỏ hàng, hiển thị danh sách sản phẩm người dùng đã thêm vào giỏ */}
        <Route path="/login" element={<LoginPage />} />{/* Trang đăng nhập */}
        <Route path="/register" element={<RegisterPage />} />{/* Trang đăng ký tài khoản */}
        <Route path="/contact" element={<ContactPage />} />{/* Trang liên hệ */}
        <Route path="/admin" element={<ProtectedRoute element={AdminDashboard} roleRequired="admin" />} />{/* Trang tổng quan của quản trị viên */}
        <Route path="/admin/products" element={<ProtectedRoute element={ProductList} roleRequired="admin" />} />{/* Trang danh sách sản phẩm trong quản trị */}
        <Route path="/admin/products/add" element={<ProtectedRoute element={ProductForm} roleRequired="admin" />} />{/* Trang chỉnh sửa thông tin sản phẩm dựa trên `id` */}
        <Route path="/admin/products/:id" element={<ProtectedRoute element={ProductForm} roleRequired="admin" />} />{/* Trang danh sách đơn hàng */}
        <Route path="/admin/orders" element={<ProtectedRoute element={OrderList} roleRequired="admin" />} />{/* Trang chi tiết đơn hàng dựa trên `id` */}
        <Route path="/admin/orders/:id" element={<ProtectedRoute element={OrderDetail} roleRequired="admin" />} />
        <Route path="/admin/users" element={<ProtectedRoute element={UserList} roleRequired="admin" />} />{/* Trang danh sách người dùng */}
        <Route path="/admin/users/add" element={<ProtectedRoute element={UserForm} roleRequired="admin" />} />{/* Trang thêm mới người dùng */}
        <Route path="/admin/users/:id" element={<ProtectedRoute element={UserForm} roleRequired="admin" />} />{/* Trang chỉnh sửa thông tin người dùng dựa trên `id` */}
        <Route path="/admin/categories" element={<ProtectedRoute element={CategoryList} roleRequired="admin" />} />{/* Trang danh sách danh mục sản phẩm */}
        <Route path="/admin/categories/add" element={<ProtectedRoute element={CategoryForm} roleRequired="admin" />} />{/* Trang thêm mới danh mục sản phẩm */}
        <Route path="/admin/categories/:id" element={<ProtectedRoute element={CategoryForm} roleRequired="admin" />} />{/* Trang chỉnh sửa danh mục sản phẩm dựa trên `id` */}
        <Route path="/admin/brands" element={<ProtectedRoute element={BrandList} roleRequired="admin" />} />{/* Trang danh sách thương hiệu */}
        <Route path="/admin/brands/add" element={<ProtectedRoute element={BrandForm} roleRequired="admin" />} />{/* Trang thêm mới thương hiệu */}
        <Route path="/admin/brands/:id" element={<ProtectedRoute element={BrandForm} roleRequired="admin" />} />{/* Trang chỉnh sửa thương hiệu dựa trên `id` */}
        <Route path="/admin/contacts" element={<ProtectedRoute element={ContactList} roleRequired="admin" />} />{/* Trang danh sách liên hệ từ khách hàng */}
      </Routes>
    </Router>
  );
}

export default App;