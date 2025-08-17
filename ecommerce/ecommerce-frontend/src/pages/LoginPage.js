import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './LoginRegisterStyles.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Gửi yêu cầu POST để đăng nhập
            const response = await axios.post('http://localhost:5000/login', { username, password });

            if (response.data.token) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;
                const userId = decodedToken.id;
                localStorage.setItem('user_id', userId);
                localStorage.setItem('username', username);
                localStorage.setItem('role', role); // Lưu vai trò vào localStorage

                // Điều hướng dựa trên vai trò
                if (role === 'admin') {
                    navigate('/admin');
                } else if (role === 'customer') {
                    navigate('/');
                } else {
                    setError('Vai trò không xác định: ' + role);
                }
            } else {
                setError('Sai "tên người dùng" hoặc "mật khẩu"');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            setError('Đăng nhập không thành công. Vui lòng thử lại!');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="text-center">Đăng Nhập</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleLogin}>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Tên Người Dùng</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            placeholder="Nhập tên người dùng"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Mật Khẩu</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Nhập mật khẩu"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Đăng Nhập</button>
                            </form>
                            <div className="mt-3 text-center">
                                <p>Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;