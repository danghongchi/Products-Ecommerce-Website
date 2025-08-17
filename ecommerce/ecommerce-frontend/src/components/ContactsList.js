import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactList = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        // Gửi yêu cầu GET để lấy danh sách các liên hệ
        axios.get('http://localhost:5000/admin/contacts')
            .then(response => {
                setContacts(response.data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách liên hệ:', error);
            });
    }, []);

    const handleDeleteContact = async (contactId) => {
        try {
            // Đảm bảo gọi đúng endpoint với /contact/:id
            await axios.delete(`http://localhost:5000/contact/${contactId}`);
            setContacts(contacts.filter(contact => contact.id !== contactId));
            console.log('Xóa liên hệ thành công');
        } catch (error) {
            console.error('Lỗi khi xóa liên hệ:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Danh Sách Liên Hệ</h1>
            <div className="mb-3">
                <Link to="/admin" className="btn btn-secondary">Quay Lại Bảng Điều Khiển Quản Trị</Link>
            </div>
            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Thông Điệp</th>
                        <th>Ngày Tạo</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.message}</td>
                            <td>{new Date(contact.created_at).toLocaleString()}</td>
                            <td>
                                <button onClick={() => handleDeleteContact(contact.id)} className="btn btn-danger btn-sm">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactList;