import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const BrandForm = () => {
    const { id } = useParams(); // Lấy tham số `id` từ URL
    const navigate = useNavigate(); // Điều hướng tới các trang khác
    const [name, setName] = useState(''); // Khởi tạo state cho tên thương hiệu

    useEffect(() => {
        if (id) {
            // Nếu có `id`, lấy thông tin chi tiết thương hiệu từ API
            axios.get(`http://localhost:5000/brands/${id}`)
                .then(response => setName(response.data.name)) // Gán dữ liệu tên thương hiệu vào state
                .catch(error => console.error('Lỗi khi lấy chi tiết thương hiệu:', error)); // In lỗi ra console nếu có
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động submit mặc định của form
        const brandData = { name }; // Chuẩn bị dữ liệu thương hiệu
        if (id) {
            // Nếu có `id`, thực hiện cập nhật thương hiệu
            await axios.put(`http://localhost:5000/brands/${id}`, brandData);
        } else {
            // Nếu không có `id`, thực hiện thêm mới thương hiệu
            await axios.post('http://localhost:5000/brands', brandData);
        }
        navigate('/admin/brands'); // Điều hướng về danh sách thương hiệu
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{id ? 'Chỉnh sửa thương hiệu' : 'Thêm mới thương hiệu'}</h1>
            <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tên</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">{id ? 'Cập nhật' : 'Thêm mới'}</button>
            </form>
            <div className="mt-3 text-center">
                <Link to="/admin/brands" className="btn btn-secondary">Quay lại danh sách thương hiệu</Link>
            </div>
        </div>
    );
};

export default BrandForm;
