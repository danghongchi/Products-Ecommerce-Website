import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image_url, setImageUrl] = useState('');
    const [category_id, setCategoryId] = useState('');
    const [brand_id, setBrandId] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await axios.get('http://localhost:5000/brands');
                setBrands(response.data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        if (id) {
            axios.get(`http://localhost:5000/products/${id}`)
                .then(response => {
                    const product = response.data;
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price);
                    setImageUrl(product.image_url);
                    setCategoryId(product.category_id);
                    setBrandId(product.brand_id);
                })
                .catch(error => console.error('Error fetching product details:', error));
        }

        fetchCategories();
        fetchBrands();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = { name, description, price, image_url, category_id, brand_id };
        if (id) {
            await axios.put(`http://localhost:5000/products/${id}`, productData);
        } else {
            await axios.post('http://localhost:5000/products', productData);
        }
        navigate('/admin/products');
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{id ? 'Edit Product' : 'Add Product'}</h1>
            <form onSubmit={handleSubmit} className="needs-validation">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tên sản phẩm</label>
                    <input type="text" className="form-control" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Mô tả</label>
                    <input type="text" className="form-control" id="description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Giá</label>
                    <input type="number" className="form-control" id="price" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="image_url" className="form-label">Image URL</label>
                    <input type="text" className="form-control" id="image_url" placeholder="Image URL" value={image_url} onChange={(e) => setImageUrl(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="category_id" className="form-label">Danh mục</label>
                    <select className="form-select" id="category_id" value={category_id} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="brand_id" className="form-label">Hãng</label>
                    <select className="form-select" id="brand_id" value={brand_id} onChange={(e) => setBrandId(e.target.value)}>
                        <option value="">Chọn hãng</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                </div>
                {image_url && <img src={image_url} alt={name} style={{ maxWidth: '200px', marginTop: '10px' }} />}
                <button type="submit" className="btn btn-primary">{id ? 'Update' : 'Add'}</button>
            </form>
            <div className="mt-3 text-center">
                <Link to="/admin/products" className="btn btn-secondary">Quay lại danh sách sản phẩm</Link>
            </div>
        </div>
    );
};

export default ProductForm;