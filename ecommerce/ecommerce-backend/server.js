const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err);
        return;
    }
    console.log('Đã kết nối với MySQL');
});

// Đăng ký người dùng
app.post('/register', async (req, res) => {
    const { username, password, role, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)';

    db.query(sql, [username, hashedPassword, role, email], (err, result) => {
        if (err) {
            console.error('Lỗi cơ sở dữ liệu:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Người dùng đã đăng ký thành công' });
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';

    db.query(sql, [username], async (err, result) => {
        if (err) {
            console.error('Lỗi cơ sở dữ liệu:', err);
            return res.status(500).json({ error: err.message });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'Tên người dùng hoặc mật khẩu không hợp lệ' });
        }

        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Tên người dùng hoặc mật khẩu không hợp lệ' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    });
});

// Lấy danh sách sản phẩm
app.get('/products', (req, res) => {
    const { category_id, brand_id } = req.query;
    let sql = `
        SELECT p.*, c.name AS category_name, b.name AS brand_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        JOIN brands b ON p.brand_id = b.id
    `;

    const conditions = [];
    const params = [];

    if (category_id) {
        const categoryIds = category_id.split(',');
        conditions.push('p.category_id IN (?)');
        params.push(categoryIds);
    }

    if (brand_id) {
        const brandIds = brand_id.split(',');
        conditions.push('p.brand_id IN (?)');
        params.push(brandIds);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
// Lấy chi tiết sản phẩm theo ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM products WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Sản phẩm không được tìm thấy' });

        res.json(result[0]);
    });
});

// Thêm sản phẩm
app.post('/products', (req, res) => {
    const { name, description, price, image_url, category_id, brand_id } = req.body;
    const sql = 'INSERT INTO products (name, description, price, image_url, category_id, brand_id) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [name, description, price, image_url, category_id, brand_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Sản phẩm đã được thêm thành công' });
    });
});

// Cập nhật sản phẩm
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, image_url, category_id, brand_id } = req.body;
    const sql = 'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, brand_id = ? WHERE id = ?';

    db.query(sql, [name, description, price, image_url, category_id, brand_id, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'S ản phẩm đã được cập nhật thành công' });
    });
});
// Xóa sản phẩm
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;

    // Kiểm tra xem sản phẩm có tồn tại trong đơn hàng không
    const checkSql = 'SELECT COUNT(*) as count FROM order_items WHERE product_id = ?';
    db.query(checkSql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result[0].count > 0) {
            return res.status(400).json({ error: 'Sản phẩm đang được liên kết với các đơn hàng hiện có và không thể xóa.' });
        }

        const sql = 'DELETE FROM products WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) {
                console.error('Lỗi xóa sản phẩm:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Sản phẩm đã được xóa thành công' });
        });
    });
});

// Thêm đơn hàng
app.post('/orders', (req, res) => {
    const { user_id, total_price, items } = req.body;
    console.log('Dữ liệu nhận được:', { user_id, total_price, items }); // Kiểm tra dữ liệu nhận được

    if (!user_id || !total_price || !items || items.length === 0) {
        return res.status(400).json({ error: 'Thiếu các trường bắt buộc: user_id, total_price, hoặc items' });
    }

    const orderSql = 'INSERT INTO orders (user_id, total_price) VALUES (?, ?)';

    db.query(orderSql, [user_id, total_price], (err, result) => {
        if (err) {
            console.error('Lỗi chèn đơn hàng:', err);
            return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu' });
        }

        const orderId = result.insertId;
        const orderItemsSql = 'INSERT INTO order_items (order_id, product_id, quantity, price, image_url) VALUES ?';
        const orderItemsValues = items.map(item => {
            const { product_id, quantity, price } = item;
            return [orderId, product_id, quantity, price, item.image_url];
        });

        db.query(orderItemsSql, [orderItemsValues], (err, result) => {
            if (err) {
                console.error('Lỗi chèn mục hàng đơn hàng:', err);
                return res.status(500).json({ error: 'Lỗi cơ sở dữ liệu' });
            }

            console.log('Các mục hàng đơn hàng đã được chèn thành công'); // Kiểm tra thành công
            res.status(201).json({ message: 'Đơn hàng đã được tạo thành công', orderId });
        });
    });
});
// Lấy danh sách đơn hàng với thông tin người dùng
app.get('/orders', (req, res) => {
    const sql = `
        SELECT o.*, u.username
        FROM orders o
        JOIN users u ON o.user_id = u.id
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Xóa đơn hàng
app.delete('/orders/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM orders WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Lỗi xóa đơn hàng:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Đơn hàng đã được xóa thành công');
        res.json({ message: 'Đơn hàng đã được xóa thành công' });
    });
});

// Lấy các mục hàng trong đơn hàng
app.get('/orders/:id/items', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT oi.id, oi.product_id, p.name AS product_name, oi.quantity, oi.price, oi.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});
// Lấy chi tiết đơn hàng
app.get('/orders/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM orders WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Đơn hàng không được tìm thấy' });

        res.json(result[0]);
    });
});
// Xóa chi tiết đơn hàng
app.delete('/orders/:id/items', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM order_items WHERE order_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Lỗi xóa mục hàng đơn hàng:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Các mục hàng đơn hàng đã được xóa thành công');
        res.json({ message: 'Các mục hàng đơn hàng đã được xóa thành công' });
    });
});

// Cập nhật thông tin người dùng
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, role, email } = req.body;
    let hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const sql = 'UPDATE users SET username = ?, password = ?, role = ?, email = ? WHERE id = ?';

    db.query(sql, [username, hashedPassword || password, role, email, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Người dùng đã được cập nhật thành công' });
    });
});
// Lấy danh sách tất cả người dùng
app.get('/users', (req, res) => {
    const sql = 'SELECT id, username, role, email FROM users';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Lấy một người dùng theo ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result[0]);
    });
});

// Xóa một người dùng
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Người dùng đã được xóa thành công' });
    });
});

// Lấy danh sách categories
app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Thêm category mới
app.post('/categories', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Tên danh mục không được để trống' });
    }
    const sql = 'INSERT INTO categories (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error('Lỗi cơ sở dữ liệu:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Danh mục đã được thêm thành công' });
    });
});

// Cập nhật category
app.put('/categories/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const sql = 'UPDATE categories SET name = ? WHERE id = ?';
    db.query(sql, [name, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Danh mục đã được cập nhật thành công' });
    });
});

// Xóa category
app.delete('/categories/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM categories WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Danh mục đã được xóa thành công' });
    });
});

// Lấy danh sách brands
app.get('/brands', (req, res) => {
    const sql = 'SELECT * FROM brands';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});

// Thêm brand mới
app.post('/brands', (req, res) => {
    const { name } = req.body;
    const sql = 'INSERT INTO brands (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Thương hiệu đã được thêm thành công' });
    });
});

// Cập nhật brand
app.put('/brands/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const sql = 'UPDATE brands SET name = ? WHERE id = ?';
    db.query(sql, [name, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Thương hiệu đã được cập nhật thành công' });
    });
});

// Xóa brand
app.delete('/brands/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM brands WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Thương hiệu đã được xóa thành công' });
    });
});

// Backend (Node.js - Express)
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Tất cả các trường đều là bắt buộc.' });
    }

    const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error submitting contact form:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi gửi thông tin liên hệ' });
        } else {
            console.log('Contact form submitted successfully!');
            return res.status(200).json({ message: 'Thông tin liên hệ đã được gửi thành công!' });
        }
    });
});

app.get('/admin/contacts', (req, res) => {
    const sql = 'SELECT * FROM contacts';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching contacts:', err);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin liên hệ' });
        } else {
            res.status(200).json(result); // Trả về danh sách liên hệ
        }
    });
});


app.delete('/contact/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM contacts WHERE id = ?';  // Đảm bảo đúng tên bảng

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy thông tin liên hệ để xóa.' });
        }

        res.json({ message: 'Thông tin liên hệ đã được xóa thành công.' });
    });
});



// Lắng nghe trên cổng 5000
app.listen(5000, () => {
    console.log('Máy chủ đang chạy trên cổng 5000');
});