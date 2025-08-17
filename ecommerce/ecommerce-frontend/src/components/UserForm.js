import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (id) {
            // Gửi yêu cầu GET để lấy chi tiết người dùng
            axios.get(`http://localhost:5000/users/${id}`)
                .then(response => {
                    const user = response.data;
                    setUsername(user.username);
                    setRole(user.role);
                    setEmail(user.email);
                })
                .catch(error => console.error('Lỗi khi lấy chi tiết người dùng:', error));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { username, password, role, email };

        try {
            if (id) {
                // Nếu có id, gửi yêu cầu PUT để cập nhật người dùng
                await axios.put(`http://localhost:5000/users/${id}`, userData);
            } else {
                // Nếu không có id, gửi yêu cầu POST để thêm người dùng mới
                await axios.post('http://localhost:5000/users', userData);
            }
            navigate('/admin/users'); // Điều hướng về danh sách người dùng
        } catch (error) {
            console.error('Lỗi khi gửi biểu mẫu:', error);
            alert('Đã xảy ra lỗi khi gửi biểu mẫu. Vui lòng kiểm tra console để biết chi tiết.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{id ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng'}</h1>
            <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Tên Người Dùng</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Tên Người Dùng"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật Khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Mật Khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Vai Trò</label>
                    <select className="form-select" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">{id ? 'Cập Nhật' : 'Thêm'}</button>
            </form>
            <div className="mt-3 text-center">
                <Link to="/admin/users" className="btn btn-secondary">Quay Lại Danh Sách Người Dùng</Link>
            </div>
        </div>
    );
};

export default UserForm;