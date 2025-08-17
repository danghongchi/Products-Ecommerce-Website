import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [contactInfoId, setContactInfoId] = useState(null); // ID của thông tin liên hệ đã gửi

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra đầu vào
        if (!formData.name || !formData.email || !formData.message) {
            setErrorMessage("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            setErrorMessage("Email không hợp lệ.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Thông tin liên hệ đã được gửi thành công!');
                setFormData({ name: '', email: '', message: '' }); // Reset form
                setContactInfoId(data.id); // Giả sử API trả về ID của thông tin liên hệ đã gửi
            } else {
                setErrorMessage(data.error || 'Đã xảy ra lỗi khi gửi thông tin liên hệ');
            }
        } catch (error) {
            setErrorMessage('Không thể kết nối với máy chủ. Vui lòng thử lại sau.');
            console.error('Error submitting contact form:', error);
        }
    };

    const handleDelete = async () => {
        if (!contactInfoId) {
            setErrorMessage('Không có thông tin liên hệ để xóa.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/contact/${contactInfoId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Thông tin liên hệ đã được xóa thành công.');
                setContactInfoId(null); // Reset ID
            } else {
                setErrorMessage(data.error || 'Đã xảy ra lỗi khi xóa thông tin liên hệ');
            }
        } catch (error) {
            setErrorMessage('Không thể kết nối với máy chủ. Vui lòng thử lại sau.');
            console.error('Error deleting contact info:', error);
        }
    };

    return (
        <>
            <Header />
            <div className="contact-page container">
                <h1 className="contact-title">Liên hệ</h1>
                <div className="contact-info">
                    <div className="contact-details">
                        <h3>Thông tin liên hệ</h3>
                        <ul>
                            <li><strong>Địa chỉ:</strong> An Phú Đông, Quận 12, TP.HCM</li>
                            <li><strong>Điện thoại:</strong> 1900 1234</li>
                            <li><strong>Email:</strong> support@ecommerce.vn</li>
                        </ul>
                    </div>
                    <div className="contact-map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31347.860971193626!2d106.67871642069487!3d10.85084951382835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752841dc80e901%3A0xbf71d3d90e1b6a5!2zQW4gUGjDuiDEkMO0bmcsIFF14bqtbiAxMiwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1733324470979!5m2!1svi!2s" width="100%" height="400" allowFullScreen="" loading="lazy" title="Google Maps"></iframe>
                    </div>
                </div>

                <div className="contact-form">
                    <h3>Liên hệ với chúng tôi</h3>
                    <form onSubmit={handleSubmit}>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}

                        <input
                            type="text"
                            name="name"
                            placeholder="Họ và tên"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Nội dung"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit">Gửi liên hệ</button>
                    </form>
                    {contactInfoId && (
                        <button onClick={handleDelete}>Xóa thông tin liên hệ</button>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};


export default ContactPage;
