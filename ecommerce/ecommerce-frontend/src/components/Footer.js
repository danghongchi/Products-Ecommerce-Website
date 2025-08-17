import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="footer">
            <div className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Về Chúng Tôi</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.</p>
                                <ul className="footer-links">
                                    <li><Link to="#"><i className="fa fa-map-marker"></i>1734 Stonecoal Road</Link></li>
                                    <li><Link to="#"><i className="fa fa-phone"></i>+021-95-51-84</Link></li>
                                    <li><Link to="#"><i className="fa fa-envelope-o"></i>email@email.com</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Danh Mục</h3>
                                <ul className="footer-links">
                                    <li><Link to="#">Khuyến mãi nóng</Link></li>
                                    <li><Link to="#">Laptop</Link></li>
                                    <li><Link to="#">Điện thoại thông minh</Link></li>
                                    <li><Link to="#">Máy ảnh</Link></li>
                                    <li><Link to="#">Phụ kiện</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="clearfix visible-xs"></div>

                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Thông Tin</h3>
                                <ul className="footer-links">
                                    <li><Link to="#">Về Chúng Tôi</Link></li>
                                    <li><Link to="#">Liên Hệ Chúng Tôi</Link></li>
                                    <li><Link to="#">Chính Sách Bảo Mật</Link></li>
                                    <li><Link to="#">Đơn Hàng và Trả Hàng</Link></li>
                                    <li><Link to="#">Điều Khoản & Điều Kiện</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-3 col-xs-6">
                            <div className="footer">
                                <h3 className="footer-title">Dịch Vụ</h3>
                                <ul className="footer-links">
                                    <li><Link to="#">Tài Khoản Của Tôi</Link></li>
                                    <li><Link to="#">Xem Giỏ Hàng</Link></li>
                                    <li><Link to="#">Danh Sách Yêu Thích</Link></li>
                                    <li><Link to="#">Theo Dõi Đơn Hàng Của Tôi</Link></li>
                                    <li><Link to="#">Trợ Giúp</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;