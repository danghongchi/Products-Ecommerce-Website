import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Gửi yêu cầu GET để lấy chi tiết đơn hàng
                const response = await axios.get(`http://localhost:5000/orders/${id}`);
                setOrder(response.data);

                // Gửi yêu cầu GET để lấy các mục trong đơn hàng
                const itemsResponse = await axios.get(`http://localhost:5000/orders/${id}/items`);
                setOrderItems(itemsResponse.data);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            }
        };

        fetchOrderDetails();
    }, [id]);

    const handleDeleteOrderItems = async () => {
        try {
            // Gửi yêu cầu DELETE để xóa các mục trong đơn hàng
            const response = await axios.delete(`http://localhost:5000/orders/${id}/items`);
            console.log(response.data); // Kiểm tra phản hồi
            setOrderItems([]);
            console.log('Xóa các mục trong đơn hàng thành công');
        } catch (error) {
            console.error('Lỗi khi xóa các mục trong đơn hàng:', error.response ? error.response.data : error.message);
        }
    };

    if (!order) return <div>Đang tải...</div>;

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Chi Tiết Đơn Hàng</h1>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Mã Đơn Hàng: {order.id}</h5>
                    <p className="card-text">Mã Người Dùng: {order.user_id}</p>
                    <p className="card-text">Tổng Giá: ${order.total_price}</p>
                    <p className="card-text">Ngày Tạo: {new Date(order.created_at).toLocaleString()}</p>
                </div>
            </div>
            <h3 className="mt-4">Các Mục Trong Đơn Hàng</h3>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>Mã Sản Phẩm</th>
                        <th>Hình Ảnh</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Số Lượng</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    {orderItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.product_id}</td>
                            <td>
                                <img src={item.image_url} alt={item.product_name} style={{ maxWidth: '100px', height: 'auto' }} />
                            </td>
                            <td>{item.product_name}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3 text-center">
                <button onClick={handleDeleteOrderItems} className="btn btn-danger mr-2">Xóa Các Mục Trong Đơn Hàng</button>
                <Link to="/admin/orders" className="btn btn-secondary">Quay Lại Danh Sách Đơn Hàng</Link>
            </div>
        </div>
    );
};

export default OrderDetail;