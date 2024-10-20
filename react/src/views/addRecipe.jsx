import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
// Import the regular CSS file
import CustomHtmlEditor from './customHtmlEditor';
import axiosClient from "../axios-client.js";


const AddRecipe = () => {
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    prep_time: '',
    ingredients: [],
    opis: '',
    sku: '',
    stock: true, // Default to true
    price: '',
    images: [], // Change from slika to images
  });
  const uploadUrl = "/upload-image";
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientName, setIngredientName]= useState('');
  const [uploadedImages, setUploadedImages] = useState([]); // Store uploaded images

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axiosClient.get('/ingredients');
        if (response.data && Array.isArray(response.data.data)) {
          console.log(response.data.data);
          setAvailableIngredients(response.data.data);
        } else {
          console.error('Expected an array of ingredients but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchIngredients();
  }, []);

  const setOpis = (value) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      opis: value,
    }));
  };

  const setShortDescription = (value) => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      short_description: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const addIngredient = () => {
    if (selectedIngredientId && ingredientQuantity) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        ingredients: [
          ...prevRecipe.ingredients,
          { id: selectedIngredientId,  quantity: ingredientQuantity },
        ],
      }));

      setSelectedIngredientId('');
      setIngredientQuantity('');
    }
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: newIngredients,
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return null; // No image to upload

    const formData = new FormData();
    formData.append('file', file);
    formData.append('custom_name', recipe.name); // You can customize this as needed
    formData.append('alt', recipe.description); // Optional alt text
    formData.append('caption', recipe.opis); // Optional caption

    try {
      const response = await axiosClient.post(uploadUrl, formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url; // Return the uploaded image URL
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
      return null; // Return null if upload fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload all images and get their URLs
    const imageUrls = await Promise.all(
      uploadedImages.map(file => handleImageUpload(file))
    );

    const formData = new FormData();
    formData.append('name', recipe.name);
    formData.append('short_description', recipe.short_description);
    formData.append('prep_time', recipe.prep_time);
    formData.append('opis', recipe.opis);
    formData.append('sku', recipe.sku);
    formData.append('stock', recipe.stock ? 1 : 0);
    formData.append('price', recipe.price);

    // Add images to the form data
    imageUrls.forEach((url) => {
      if (url) {
        formData.append('images[]', url); // Append each image URL
      }
    });

    recipe.ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][id]`, ingredient.id);
      formData.append(`ingredients[${index}][name]`, ingredient.id);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    });

    try {
      console.log(formData);
      const response = await axiosClient.post('/recipes', formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Recipe created:', response.data);
    } catch (error) {
      console.error('Error creating recipe:', error.response?.data || error.message);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true, // Allow multiple images
    onDrop: (acceptedFiles) => {
      setUploadedImages((prevImages) => [
        ...prevImages,
        ...acceptedFiles,
      ]);
    },
  });

  return (
    <div className="admin-dashboard">


      <form onSubmit={handleSubmit} className="recipeForm">
        <div className="formLayout">
          <div className="leftColumn">
            <h2>Add a New Recipe</h2>
            <input
              type="text"
              name="name"
              value={recipe.name}
              onChange={handleChange}
              placeholder="Recipe Name"
              required
              className="inputField"
              style={{ marginBottom: '40px' }}
            />
            <h2>Short description</h2>
            <CustomHtmlEditor
              onChange={setShortDescription}
              uploadUrl={uploadUrl}
              height="130px"
              style={{ marginBottom: '40px'}}
            />
            <h2>Product description</h2>
            <CustomHtmlEditor
              onChange={setOpis}
              uploadUrl={uploadUrl}
              height="400px"
              style={{ marginBottom: '20px' }}
            />
            <input
              type="text"
              name="sku"
              value={recipe.sku}
              onChange={handleChange}
              placeholder="SKU (optional)"
              className="inputField"
              style={{marginTop:"30px"}}
            />
            <input
              type="number"
              name="price"
              value={recipe.price}
              onChange={handleChange}
              placeholder="Price"
              className="inputField"
              style={{marginTop:"5px"}}
            />
            <label>
              <input
                type="checkbox"
                name="stock"
                checked={recipe.stock}
                onChange={(e) => setRecipe({ ...recipe, stock: e.target.checked })}
              />
              In Stock
            </label>
            <h3>Ingredients</h3>
            <select
              value={selectedIngredientId}
              onChange={(e) => setSelectedIngredientId(e.target.value)}
              className="ingredientSelect"
            >
              <option value="">Select an ingredient</option>
              {availableIngredients.map((ingredient) => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={ingredientQuantity}
              onChange={(e) => setIngredientQuantity(e.target.value)}
              placeholder="Quantity"
              className="inputField"
            />
            <button type="button" onClick={addIngredient} className="addIngredientButton">Add Ingredient</button>
            <div className="ingredientsList">
              {recipe.ingredients.map((ingredient, index) => {
                const ingredientName = availableIngredients.find(ing => ing.id === Number(ingredient.id))?.name;
                return (
                  <div key={index} className="ingredientRow">
                    <span>{ingredientName ? `${ingredientName} - ${ingredient.quantity}` : 'Unknown Ingredient'}</span>
                    <button type="button" onClick={() => removeIngredient(index)} className="removeButton">Remove</button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rightColumn">
            <h3>Product Images</h3>
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
                  <img key={index} src={URL.createObjectURL(file)} alt="Recipe" className="image" />
                ))}
              </div>
            )}
            <input
              type="number"
              name="prep_time"
              value={recipe.prep_time}
              onChange={handleChange}
              placeholder="Preparation Time (minutes)"
              required
              className="inputField"
              style={{marginTop:"10px"}}
            />
          </div>
        </div>
        <button type="submit" className="submitButton">Submit Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
