import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [quantity, setQuantity] = useState(1); // State để lưu số lượng sản phẩm
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Gửi yêu cầu GET để lấy chi tiết sản phẩm
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            }
        };

        fetchProduct();

        // Lấy giỏ hàng từ localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
    }, [id]);

    if (!product) return <div>Đang tải...</div>;

    const handleAddToCart = (product) => {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItem = cartItems.find(item => item.id === product.id);
        const updatedCart = existingItem
            ? cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
            )
            : [...cartItems, { ...product, quantity }];

        // Cập nhật giỏ hàng và lưu vào localStorage
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setQuantity(1); // Đặt lại số lượng về 1 sau khi thêm vào giỏ hàng
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1)); // Đảm bảo số lượng không nhỏ hơn 1
    };

    return (
        <div>
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartItems={cartItems} />
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-5">
                            <div className="product-details">
                                <h2 className="product-name">{product.name}</h2>
                                <div>
                                    <h3 className="product-price">${product.price} <del className="product-old-price">${product.price + 10}</del></h3>
                                    <span className="product-available">Còn hàng</span>
                                </div>
                                <p>{product.description}</p>

                                <div className="add-to-cart">
                                    <div className="qty-label">
                                        Số lượng
                                        <div className="input-number">
                                            <input type="number" min="1" value={quantity} readOnly />
                                            <span className="qty-up" onClick={increaseQuantity}>+</span>
                                            <span className="qty-down" onClick={decreaseQuantity}>-</span>
                                        </div>
                                    </div>
                                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                                        <i className="fa fa-shopping-cart"></i> Thêm vào giỏ hàng
                                    </button>
                                </div>

                                <ul className="product-links">
                                    <li>Danh mục:</li>
                                    <li><a href="#">Tai nghe</a></li>
                                    <li><a href="#">Phụ kiện</a></li>
                                </ul>

                                <ul className="product-links">
                                    <li>Chia sẻ:</li>
                                    <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                    <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                    <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                                    <li><a href="#"><i className="fa fa-envelope"></i></a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="product-img">
                                <img src={product.image_url} alt={product.name} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;