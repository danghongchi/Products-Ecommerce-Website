import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    useEffect(() => {
        // Hàm lấy danh sách sản phẩm
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/products', {
                    params: {
                        category_id: selectedCategories.join(','),
                        brand_id: selectedBrands.join(',')
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
            }
        };

        // Hàm lấy danh sách danh mục
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
            }
        };

        // Hàm lấy danh sách thương hiệu
        const fetchBrands = async () => {
            try {
                const response = await axios.get('http://localhost:5000/brands');
                setBrands(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy thương hiệu:', error);
            }
        };

        fetchProducts();
        fetchCategories();
        fetchBrands();

        // Lấy giỏ hàng từ localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
    }, [selectedCategories, selectedBrands]);

    // Hàm thêm sản phẩm vào giỏ hàng
    const handleAddToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        const updatedCart = existingItem
            ? cartItems.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
            : [...cartItems, { ...product, quantity: 1 }];

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Hàm xử lý thay đổi danh mục
    const handleCategoryChange = (categoryId) => {
        setSelectedCategories(prevCategories =>
            prevCategories.includes(categoryId)
                ? prevCategories.filter(id => id !== categoryId)
                : [...prevCategories, categoryId]
        );
    };

    // Hàm xử lý thay đổi thương hiệu
    const handleBrandChange = (brandId) => {
        setSelectedBrands(prevBrands =>
            prevBrands.includes(brandId)
                ? prevBrands.filter(id => id !== brandId)
                : [...prevBrands, brandId]
        );
    };

    // Lọc sản phẩm theo từ khóa tìm kiếm
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div>
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} cartItems={cartItems} />

            <div className="section">
                <div className="container">
                    <div className="row">
                        <div id="aside" className="col-md-3">
                            <div className="aside">
                                <h3 className="aside-title">Danh mục</h3>
                                <div className="checkbox-filter">
                                    {categories.map(category => (
                                        <div className="input-checkbox" key={category.id}>
                                            <input
                                                type="checkbox"
                                                id={`category-${category.id}`}
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => handleCategoryChange(category.id)}
                                            />
                                            <label htmlFor={`category-${category.id}`}>
                                                <span></span>
                                                {category.name}
                                                <small>({category.count})</small>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="aside">
                                <h3 className="aside-title">Thương hiệu</h3>
                                <div className="checkbox-filter">
                                    {brands.map(brand => (
                                        <div className="input-checkbox" key={brand.id}>
                                            <input
                                                type="checkbox"
                                                id={`brand-${brand.id}`}
                                                checked={selectedBrands.includes(brand.id)}
                                                onChange={() => handleBrandChange(brand.id)}
                                            />
                                            <label htmlFor={`brand-${brand.id}`}>
                                                <span></span>
                                                {brand.name}
                                                <small>({brand.count})</small>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div id="store" className="col-md-9">
                            <div className="store-filter clearfix">
                                <div className="store-sort">
                                    <label>
                                        Sắp xếp theo:
                                        <select className="input-select">
                                            <option value="0">Phổ biến</option>
                                            <option value="1">Vị trí</option>
                                        </select>
                                    </label>
                                    <label>
                                        Hiển thị:
                                        <select className="input-select">
                                            <option value="0">20</option>
                                            <option value="1">50</option>
                                        </select>
                                    </label>
                                </div>
                                <ul className="store-grid">
                                    <li className="active"><i className="fa fa-th"></i></li>
                                    <li><Link to="#"><i className="fa fa-th-list"></i></Link></li>
                                </ul>
                            </div>
                            <div className="row">
                                {filteredProducts.map(product => (
                                    <div className="col-md-3 col-xs-6" key={product.id}>
                                        <div className="product">
                                            <div className="product-img">
                                                <img src={product.image_url} alt={product.name} />
                                                <div className="product-label">
                                                    <span className="sale">-30%</span>
                                                    <span className="new">MỚI</span>
                                                </div>
                                            </div>
                                            <div className="product-body">
                                                <p className="product-category">Danh mục</p>
                                                <h3 className="product-name"><Link to="#">{product.name}</Link></h3>
                                                <h4 className="product-price">${product.price} <del className="product-old-price">${product.price % 10}</del></h4>
                                            </div>
                                            <div className="add-to-cart">
                                                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                                                    <i className="fa fa-shopping-cart"></i> thêm vào giỏ hàng
                                                </button>
                                                <button className="add-to-cart-btn">
                                                    <Link to={`/product/${product.id}`} onClick={() => console.log(`/product/${product.id}`)}>Xem chi tiết</Link>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="store-filter clearfix">
                                <span className="store-qty">Hiển thị {filteredProducts.length} sản phẩm</span>
                                <ul className="store-pagination">
                                    <li className="active">1</li>
                                    <li><Link to="#">2</Link></li>
                                    <li><Link to="#">3</Link></li>
                                    <li><Link to="#">4</Link></li>
                                    <li><Link to="#"><i className="fa fa-angle-right"></i></Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    );
};

export default HomePage;