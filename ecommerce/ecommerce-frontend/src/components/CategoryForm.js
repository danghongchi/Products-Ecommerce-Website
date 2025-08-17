import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoryForm = () => {
    const { id } = useParams(); // Lấy id từ tham số URL
    const navigate = useNavigate(); // Điều hướng giữa các trang
    const [name, setName] = useState(''); // Trạng thái cho tên danh mục

    useEffect(() => {
        if (id) {
            // Nếu có id, lấy thông tin chi tiết danh mục từ API
            axios.get(`http://localhost:5000/categories/${id}`)
                .then(response => setName(response.data.name)) // Đặt giá trị tên từ dữ liệu trả về
                .catch(error => console.error('Lỗi khi lấy thông tin danh mục:', error));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn không cho tải lại trang khi gửi form
        const categoryData = { name }; // Tạo dữ liệu danh mục từ trạng thái

        if (!name) {
            alert('Tên danh mục không được để trống'); // Kiểm tra dữ liệu đầu vào
            return;
        }

        try {
            if (id) {
                // Nếu có id, gọi API cập nhật danh mục
                await axios.put(`http://localhost:5000/categories/${id}`, categoryData);
            } else {
                // Nếu không có id, gọi API thêm mới danh mục
                await axios.post('http://localhost:5000/categories', categoryData);
            }
            navigate('/admin/categories'); // Điều hướng về danh sách danh mục
        } catch (error) {
            console.error('Lỗi khi gửi form:', error);
            alert('Đã xảy ra lỗi khi gửi form. Vui lòng kiểm tra lại trên bảng điều khiển.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</h1>
            <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tên</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Tên danh mục"
                        value={name}
                        onChange={(e) => setName(e.target.value)} // Cập nhật trạng thái khi thay đổi giá trị
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">{id ? 'Cập nhật' : 'Thêm mới'}</button>
            </form>
            <div className="mt-3 text-center">
                <Link to="/admin/categories" className="btn btn-secondary">Quay lại danh sách danh mục</Link>
            </div>
        </div>
    );
};

export default CategoryForm;
