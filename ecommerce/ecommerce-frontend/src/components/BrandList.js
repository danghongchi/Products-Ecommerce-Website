import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BrandList = () => {
    const [brands, setBrands] = useState([]); // Khởi tạo state để lưu danh sách thương hiệu

    useEffect(() => {
        // Lấy danh sách thương hiệu từ API
        axios.get('http://localhost:5000/brands')
            .then(response => setBrands(response.data)) // Gán dữ liệu danh sách thương hiệu vào state
            .catch(error => console.error('Lỗi khi lấy danh sách thương hiệu:', error)); // In lỗi ra console nếu có
    }, []);

    const handleDelete = (id) => {
        // Xác nhận trước khi xóa thương hiệu
        if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) {
            axios.delete(`http://localhost:5000/brands/${id}`)
                .then(() => setBrands(brands.filter(brand => brand.id !== id))) // Cập nhật danh sách sau khi xóa
                .catch(error => console.error('Lỗi khi xóa thương hiệu:', error)); // In lỗi ra console nếu có
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Danh sách thương hiệu</h1>
            <div className="mb-3">
                <Link to="/admin/brands/add" className="btn btn-primary">Thêm thương hiệu</Link>
            </div>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map(brand => (
                        <tr key={brand.id}>
                            <td>{brand.id}</td>
                            <td>{brand.name}</td>
                            <td>
                                <Link to={`/admin/brands/${brand.id}`} className="btn btn-warning btn-sm me-2">Chỉnh sửa</Link>
                                <button onClick={() => handleDelete(brand.id)} className="btn btn-danger btn-sm">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3 text-center">
                <Link to="/admin" className="btn btn-secondary">Quay lại bảng điều khiển quản trị</Link>
            </div>
        </div>
    );
};

export default BrandList;
