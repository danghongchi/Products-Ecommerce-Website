// components/Cart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]); // Khởi tạo state cho danh sách sản phẩm trong giỏ hàng
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Xác định trạng thái đăng nhập
    const [userId, setUserId] = useState(null); // Lưu trữ ID người dùng
    const navigate = useNavigate(); // Điều hướng trang
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm

    useEffect(() => {
        // Lấy token và trạng thái đăng nhập từ localStorage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Lấy user_id từ localStorage
        const storedUserId = localStorage.getItem('user_id');
        setUserId(storedUserId);

        // Lấy danh sách sản phẩm trong giỏ hàng từ localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
    }, []);

    // Xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Cập nhật lại localStorage
    };

    // Xử lý đặt hàng
    const handleCheckout = async () => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập trước khi đặt hàng.');
            navigate('/login'); // Điều hướng đến trang đăng nhập
            return;
        }

        if (!userId) {
            console.error('Thiếu ID người dùng');
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            return;
        }

        if (cartItems.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }

        // Tính tổng giá trị đơn hàng
        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const items = cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            image_url: item.image_url // Thêm đường dẫn hình ảnh sản phẩm
        }));

        console.log('Dữ liệu đơn hàng gửi đi:', { user_id: userId, total_price: totalPrice, items }); // Kiểm tra dữ liệu trước khi gửi

        try {
            const response = await axios.post('http://localhost:5000/orders', { user_id: userId, total_price: totalPrice, items });
            console.log('Phản hồi từ server:', response.data);
            alert('Đặt hàng thành công!');
            localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi đặt hàng thành công
            navigate('/'); // Điều hướng về trang chủ
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error);
            alert('Đặt hàng thất bại. Vui lòng thử lại sau.');
        }
    };

    // Xử lý thay đổi số lượng sản phẩm trong giỏ hàng
    const handleQuantityChange = (productId, newQuantity) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Cập nhật lại localStorage
    };

    // Tính tổng giá trị giỏ hàng
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Điều hướng về trang chủ
    const goToHomePage = () => {
        navigate('/');
    };

    return (
        <div>
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartItems={cartItems} />
            <section className="h-100 h-custom" style={{ backgroundColor: '#d2c9ff' }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12">
                            <div className="card card-registration card-registration-2" style={{ borderRadius: '15px' }}>
                                <div className="card-body p-0">
                                    <div className="row g-0">
                                        <div className="col-lg-8">
                                            <div className="p-5">
                                                <div className="d-flex justify-content-between align-items-center mb-5">
                                                    <h1 className="fw-bold mb-0">Giỏ hàng</h1>
                                                    <h6 className="mb-0 text-muted">{cartItems.length} sản phẩm</h6>
                                                </div>
                                                <hr className="my-4" />

                                                {cartItems.map(item => (
                                                    <div key={item.id} className="row mb-4 d-flex justify-content-between align-items-center">
                                                        <div className="col-md-2 col-lg-2 col-xl-2">
                                                            <img src={item.image_url} alt={item.name} className="img-fluid rounded-3" />
                                                        </div>
                                                        <div className="col-md-3 col-lg-3 col-xl-3">
                                                            <h6 className="text-muted">{item.category || 'Danh mục'}</h6>
                                                            <h6 className="mb-0">{item.name}</h6>
                                                        </div>
                                                        <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                                            <button className="btn btn-link px-2" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                                                <i className="fas fa-minus"></i>
                                                            </button>
                                                            <input
                                                                id={`form1-${item.id}`}
                                                                min="0"
                                                                name="quantity"
                                                                value={item.quantity}
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                            />
                                                            <button className="btn btn-link px-2" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                                            <h6 className="mb-0">${item.price * item.quantity}</h6>
                                                        </div>
                                                        <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                                            <a href="#!" className="text-muted" onClick={() => handleRemoveFromCart(item.id)}><i className="fas fa-times"></i></a>
                                                        </div>
                                                    </div>
                                                ))}

                                                <hr className="my-4" />

                                                <div className="pt-5">
                                                    <h6 className="mb-0"><a href="#!" className="text-body" onClick={goToHomePage}><i className="fas fa-long-arrow-alt-left me-2"></i>Quay lại cửa hàng</a></h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 bg-body-tertiary">
                                            <div className="p-5">
                                                <h3 className="fw-bold mb-5 mt-2 pt-1">Tóm tắt</h3>
                                                <hr className="my-4" />

                                                <div className="d-flex justify-content-between mb-4">
                                                    <h5 className="text-uppercase">Số lượng sản phẩm {cartItems.length}</h5>
                                                    <h5>${totalPrice}</h5>
                                                </div>

                                                <h5 className="text-uppercase mb-3">Phí giao hàng</h5>

                                                <div className="mb-4 pb-2">
                                                    <select className="form-select">
                                                        <option value="1">Giao hàng tiêu chuẩn - $5.00</option>
                                                        <option value="2">Hai</option>
                                                        <option value="3">Ba</option>
                                                        <option value="4">Bốn</option>
                                                    </select>
                                                </div>

                                                <h5 className="text-uppercase mb-3">Nhập mã giảm giá</h5>

                                                <div className="mb-5">
                                                    <div className="form-outline">
                                                        <input type="text" id="form3Examplea2" className="form-control form-control-lg" />
                                                        <label className="form-label" htmlFor="form3Examplea2">Nhập mã của bạn</label>
                                                    </div>
                                                </div>

                                                <hr className="my-4" />

                                                <div className="d-flex justify-content-between mb-5">
                                                    <h5 className="text-uppercase">Tổng cộng</h5>
                                                    <h5>${totalPrice + 5}</h5>
                                                </div>

                                                <button type="button" className="btn btn-dark btn-block btn-lg" onClick={handleCheckout}>Đặt hàng</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Cart;
