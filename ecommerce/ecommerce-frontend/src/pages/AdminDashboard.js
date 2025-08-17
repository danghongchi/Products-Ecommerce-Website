import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css'; // Import file CSS tùy chỉnh
import { FaUserCog, FaBoxOpen, FaShoppingCart, FaTags, FaClipboardList, FaEnvelope } from 'react-icons/fa'; // Import các biểu tượng

const AdminDashboard = () => {
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center mb-4">Trang quản trị</h1>
                    <div className="text-center mb-4">
                        {/* Kiểm tra xem người dùng đã đăng nhập chưa */}
                        {localStorage.getItem('token') ? (
                            <div>
                                <span className="mr-3">Chào mừng, {localStorage.getItem('username') || 'ADMIN'}</span>
                                <button className="btn btn-danger" onClick={() => { localStorage.clear(); window.location.reload(); }}>
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
                        )}
                    </div>
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Menu quản trị</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <Link to="/admin/products" className="btn btn-link">
                                        <FaBoxOpen /> Quản lý sản phẩm
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link to="/admin/orders" className="btn btn-link">
                                        <FaShoppingCart /> Quản lý đơn hàng
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link to="/admin/users" className="btn btn-link">
                                        <FaUserCog /> Quản lý người dùng
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link to="/admin/categories" className="btn btn-link">
                                        <FaTags /> Quản lý danh mục
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link to="/admin/brands" className="btn btn-link">
                                        <FaClipboardList /> Quản lý thương hiệu
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link to="/admin/contacts" className="btn btn-link">
                                        <FaEnvelope /> Quản lý liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
