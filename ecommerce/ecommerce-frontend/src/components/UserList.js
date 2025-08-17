import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserList = () => {
    const [users, setUsers] = useState([]); // Trạng thái lưu danh sách người dùng

    useEffect(() => {
        // Lấy danh sách người dùng từ API
        axios.get('http://localhost:5000/users')
            .then(response => setUsers(response.data)) // Cập nhật trạng thái danh sách người dùng
            .catch(error => console.error('Lỗi khi lấy danh sách người dùng:', error));
    }, []);

    const handleDelete = (id) => {
        // Hàm xử lý xóa người dùng
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            axios.delete(`http://localhost:5000/users/${id}`)
                .then(() => setUsers(users.filter(user => user.id !== id))) // Cập nhật danh sách sau khi xóa
                .catch(error => console.error('Lỗi khi xóa người dùng:', error));
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Danh sách người dùng</h1>

            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <Link to={`/admin/users/${user.id}`} className="btn btn-warning btn-sm me-2">Chỉnh sửa</Link>
                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3 text-center">
                <Link to="/admin" className="btn btn-secondary">Quay lại trang quản trị</Link>
            </div>
        </div>
    );
};

export default UserList;
