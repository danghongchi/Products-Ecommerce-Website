import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
    const [products, setProducts] = useState([]); // Trạng thái lưu danh sách sản phẩm
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy danh sách sản phẩm từ API
        axios.get('http://localhost:5000/products')
            .then(response => setProducts(response.data)) // Cập nhật danh sách sản phẩm vào trạng thái
            .catch(error => console.error('Lỗi khi lấy danh sách sản phẩm:', error));
    }, []);

    const handleDelete = (id) => {
        // Hàm xử lý xóa sản phẩm
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            axios.delete(`http://localhost:5000/products/${id}`)
                .then(response => {
                    alert(response.data.message); // Hiển thị thông báo xóa thành công
                    setProducts(products.filter(product => product.id !== id)); // Cập nhật danh sách sản phẩm sau khi xóa
                })
                .catch(error => {
                    // Xử lý lỗi khi xóa sản phẩm
                    if (error.response && error.response.status === 400) {
                        alert(error.response.data.error); // Hiển thị thông báo lỗi từ server
                    } else {
                        console.error('Lỗi khi xóa sản phẩm:', error);
                        alert('Đã xảy ra lỗi khi xóa sản phẩm.');
                    }
                });
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Danh sách sản phẩm</h1>
            <div className="mb-3">
                <Link to="/admin/products/add" className="btn btn-primary">Thêm sản phẩm</Link>
            </div>
            <div className="mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Quay lại trang quản trị</button>
            </div>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Giá</th>
                        <th>Danh mục</th>
                        <th>Thương hiệu</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>
                                <img src={product.image_url} alt={product.name} style={{ maxWidth: '100px', height: 'auto' }} />
                            </td>
                            <td>
                                <Link to={`/product/${product.id}`}>{product.name}</Link>
                            </td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>{product.category_name}</td>
                            <td>{product.brand_name}</td>
                            <td>
                                <Link to={`/admin/products/${product.id}`} className="btn btn-warning btn-sm me-2">Chỉnh sửa</Link>
                                <button onClick={() => handleDelete(product.id)} className="btn btn-danger btn-sm">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
