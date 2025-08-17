import { Link } from 'react-router-dom';
import React from 'react';
import './Header.css';

const Header = ({ searchTerm, setSearchTerm, cartItems = [] }) => {

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <header id="header">
            <div className="container">
                <div className="row">
                    <div className="col-md-2">
                        <div className="header-logo">
                            <Link to="/" className="logo">
                                <img src="/logopage.png" alt="Logo" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="header-search">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <select className="input-select">
                                    <option value="0">All Categories</option>

                                </select>
                                <input
                                    className="input"
                                    placeholder="Nhập tại đây"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="search-btn">Tìm kiếm</button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-4 clearfix">
                        <div className="header-ctn">
                            <div className="nav-links">
                                <Link to="/contact">Liên hệ</Link>
                            </div>
                            <div>
                                {localStorage.getItem('token') ? (
                                    <div className="d-flex align-items-center">
                                        <span className="mr-2">Chào mừng, {localStorage.getItem('username') || 'User '}</span>
                                        <div>
                                            <button className="btn btn-outline-secondary" onClick={() => { localStorage.clear(); window.location.reload(); }}>Đăng xuất</button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
                                )}
                            </div>
                            <div className="dropdown">
                                <Link className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                                    <i className="fa fa-shopping-cart"></i>
                                    <span>giỏ hàng của bạn</span>
                                    <div className="qty">{cartItems.length}</div>
                                </Link>
                                <div className="cart-dropdown">
                                    <div className="cart-list">
                                        {cartItems.map(item => (
                                            <div className="product-widget" key={item.id}>
                                                <div className="product-img">
                                                    <img src={item.image_url} alt={item.name} />
                                                </div>
                                                <div className="product-body">
                                                    <h3 className="product-name"><Link to="#">{item.name}</Link></h3>
                                                    <h4 className="product-price"><span className="qty">{item.quantity}x</span>${item.price}</h4>
                                                </div>
                                                <button className="delete" onClick={() => handleRemoveFromCart(item.id)}><i className="fa fa-close"></i></button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="cart-summary">
                                        <small>{cartItems.length} Item(s) selected</small>
                                        <h5>SUBTOTAL: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</h5>
                                    </div>
                                    <div className="cart-btns text-center">
                                        <Link to="/cart" className="btn btn-primary">Xem giỏ hàng</Link>
                                    </div>
                                </div>
                            </div>

                            <div className="menu-toggle">
                                <Link to="#">
                                    <i className="fa fa-bars"></i>
                                    <span>Menu</span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
