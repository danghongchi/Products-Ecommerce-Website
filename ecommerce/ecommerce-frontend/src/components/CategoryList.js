import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Gọi API để lấy danh sách danh mục
        axios.get('http://localhost:5000/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error('Lỗi khi lấy danh mục:', error));
    }, []);

    const handleDelete = (id) => {
        // Xác nhận trước khi xóa danh mục
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            axios.delete(`http://localhost:5000/categories/${id}`)
                .then(() => setCategories(categories.filter(category => category.id !== id)))
                .catch(error => console.error('Lỗi khi xóa danh mục:', error));
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Danh Sách Danh Mục</h1>
            <div className="mb-3">
                <Link to="/admin/categories/add" className="btn btn-primary">Thêm Danh Mục</Link>
            </div>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>
                                <Link to={`/admin/categories/${category.id}`} className="btn btn-warning btn-sm me-2">Chỉnh Sửa</Link>
                                <button onClick={() => handleDelete(category.id)} className="btn btn-danger btn-sm">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3 text-center">
                <Link to="/admin" className="btn btn-secondary">Quay Lại Bảng Điều Khiển Quản Trị</Link>
            </div>
        </div>
    );
};

export default CategoryList;