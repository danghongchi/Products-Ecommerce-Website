// components/OrderList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]); // Trạng thái lưu danh sách đơn hàng

    useEffect(() => {
        // Lấy danh sách đơn hàng từ API
        axios.get('http://localhost:5000/orders')
            .then(response => setOrders(response.data)) // Đặt dữ liệu đơn hàng vào trạng thái
            .catch(error => console.error('Lỗi khi lấy danh sách đơn hàng:', error));
    }, []);

    const handleDeleteOrder = async (orderId) => {
        // Hàm xử lý xóa đơn hàng
        try {
            await axios.delete(`http://localhost:5000/orders/${orderId}`); // Gọi API để xóa đơn hàng
            setOrders(orders.filter(order => order.id !== orderId)); // Cập nhật danh sách đơn hàng sau khi xóa
            console.log('Xóa đơn hàng thành công');
        } catch (error) {
            console.error('Lỗi khi xóa đơn hàng:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Danh sách đơn hàng</h1>
            <div className="mb-3">
                <Link to="/admin" className="btn btn-secondary">Quay lại trang quản trị</Link>
            </div>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>ID người dùng</th>
                        <th>Tên người dùng</th>
                        <th>Tổng giá</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_id}</td>
                            <td>{order.username}</td>
                            <td>${order.total_price}</td>
                            <td>{new Date(order.created_at).toLocaleString()}</td>
                            <td>
                                <Link to={`/admin/orders/${order.id}`} className="btn btn-info btn-sm mr-2">Xem chi tiết</Link>
                                <button onClick={() => handleDeleteOrder(order.id)} className="btn btn-danger btn-sm">Xử lý đơn hàng</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
