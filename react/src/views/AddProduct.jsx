import React, { useState, useEffect } from 'react';
import axiosClient from "../axios-client.js";
import { useDropzone } from 'react-dropzone';
import CustomHtmlEditor from './customHtmlEditor';

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: '',
    intro: '',
    body: '',
    featured_image: '',
    gallery: [],
    meta_title: '',
    meta_description: '',
    keywords: '',
    schema_markup: '',
    categories: [], // Store selected categories
    regular_price: '',
    sale_price: '',
    sku: '',
    stock_status: 'in_stock', // Default stock status
    status: 'draft',
    url: '',
  });

  const uploadUrl = "/upload-image";
  const [availableCategories, setAvailableCategories] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get('/product_categories');
        if (response.data && Array.isArray(response.data.data)) {
          setAvailableCategories(response.data.data);
        } else {
          console.error('Expected an array of categories but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const setIntro = (value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      intro: value,
    }));
  };

  const setBody = (value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      body: value,
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosClient.post(uploadUrl, formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
      return null;
    }
  };

  const handleCategorySelect = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleAddCategory = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      categories: [...prevProduct.categories, selectedCategoryId],
    }));
    setSelectedCategoryId(''); // Reset selected category after adding
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload all images and get their URLs
    const imageUrls = await Promise.all(
      uploadedImages.map(file => handleImageUpload(file))
    );

    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('intro', product.intro);
    formData.append('body', product.body);
    formData.append('status', product.status);
    formData.append('url', product.url);
    formData.append('meta_title', product.meta_title);
    formData.append('meta_description', product.meta_description);
    formData.append('keywords', product.keywords);
    formData.append('schema_markup', product.schema_markup);
    formData.append('regular_price', product.regular_price);
    formData.append('sale_price', product.sale_price);
    formData.append('sku', product.sku);
    formData.append('stock_status', product.stock_status);

    product.categories.forEach((catId) => {
      formData.append('categories[]', catId); // Change from 'categories_id' to 'categories[]'
    });


    imageUrls.forEach((url) => {
      if (url) {
        formData.append('gallery[]', url); // Use gallery[] for multiple images
      }
    });

    try {
      const response = await axiosClient.post('/products', formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product created:', response.data);
    } catch (error) {
      console.error('Error creating product:', error.response?.data || error.message);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: (acceptedFiles) => {
      setUploadedImages((prevImages) => [...prevImages, ...acceptedFiles]);
    },
  });

  return (
    <div className="admin-dashboard">
      <form onSubmit={handleSubmit} className="productForm">
        <h2>Add a New Product</h2>
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleChange}
          placeholder="Product Title"
          required
          className="inputField"
        />
        <h2>Product Intro</h2>
        <CustomHtmlEditor
          onChange={setIntro}
          uploadUrl={uploadUrl}
          height="130px"
          style={{ marginBottom: '20px' }}
        />
        <h2>Product Body</h2>
        <CustomHtmlEditor
          onChange={setBody}
          uploadUrl={uploadUrl}
          height="400px"
          style={{ marginBottom: '20px' }}
        />
        <label>
          Regular Price:
          <input
            type="number"
            name="regular_price"
            value={product.regular_price}
            onChange={handleChange}
            placeholder="Regular Price"
            required
            className="inputField"
          />
        </label>
        <label>
          Sale Price:
          <input
            type="number"
            name="sale_price"
            value={product.sale_price}
            onChange={handleChange}
            placeholder="Sale Price"
            className="inputField"
          />
        </label>
        <label>
          SKU:
          <input
            type="text"
            name="sku"
            value={product.sku}
            onChange={handleChange}
            placeholder="SKU"
            required
            className="inputField"
          />
        </label>
        <label>
          Stock Status:
          <select
            name="stock_status"
            value={product.stock_status}
            onChange={handleChange}
            className="inputField"
          >
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </label>
        <label>
          Select Category:&nbsp;&nbsp;&nbsp;
          <select
            name="categoriesId"
            value={selectedCategoryId}
            onChange={handleCategorySelect}
            className="inputField"
          >
            <option value="">Select Category</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>

        <button type="button" onClick={handleAddCategory} className="addCategoryButton">
          Add Category
        </button>

        <label>
          URL:
          <input
            type="text"
            name="url"
            value={product.url}
            onChange={handleChange}
            placeholder="Product URL"
            required
            className="inputField"
          />
        </label>
        <label>
          Meta Title:
          <input
            type="text"
            name="meta_title"
            value={product.meta_title}
            onChange={handleChange}
            placeholder="Meta Title"
            className="inputField"
          />
        </label>
        <label>
          Meta Description:
          <textarea
            name="meta_description"
            value={product.meta_description}
            onChange={handleChange}
            placeholder="Meta Description"
            className="inputField"
          />
        </label>
        <label>
          Keywords:
          <input
            type="text"
            name="keywords"
            value={product.keywords}
            onChange={handleChange}
            placeholder="Keywords"
            className="inputField"
          />
        </label>
        <label>
          Schema Markup:
          <textarea
            name="schema_markup"
            value={product.schema_markup}
            onChange={handleChange}
            placeholder="Schema Markup"
            className="inputField"
          />
        </label>
        <h3>Gallery Images</h3>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {uploadedImages.length > 0 ? (
            <div>
              {uploadedImages.map((file, index) => (
                <p key={index}>{file.name}</p>
              ))}
            </div>
          ) : (
            <p>Drag & drop images here, or click to select</p>
          )}
        </div>
        {uploadedImages.length > 0 && (
          <div className="imagePreview">
            <h4>Uploaded Images:</h4>
            {uploadedImages.map((file, index) => (
              <img key={index} src={URL.createObjectURL(file)} alt={file.name} width={100} />
            ))}
          </div>
        )}
        <button type="submit" className="submitButton">Submit</button>
      </form>
    </div>
  );
};

export default AddProduct;
