import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import CustomHtmlEditor from './customHtmlEditor';
import axiosClient from "../axios-client.js";
import ImageUploadModal from "./ImageUploadModal.jsx";

const AddPost = () => {
  const [post, setPost] = useState({
    title: '',
    intro: '',
    body: '',
    featured_image: '',
    status: 'draft', // Default status
    url: '', // Added URL field
    meta_title: '', // Added Meta Title field
    keywords: '', // Added Keywords field
    schema_markup: '', // Added Schema Markup field
    authorId: '', // Store selected author ID
    categoriesId: [], // Store selected category ID
    images: [],
  });

  const uploadUrl = "/upload-image";
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [uploadedImageId, setUploadedImageId] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axiosClient.get('/authors');
        if (response.data && Array.isArray(response.data.data)) {
          console.log(response.data.data);
          setAvailableAuthors(response.data.data);
        } else {
          console.error('Expected an array of authors but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };

    fetchAuthors();

    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get('/post_categories');
        if (response.data && Array.isArray(response.data.data)) {
          console.log(response.data.data);
          setAvailableCategories(response.data.data);
        } else {
          console.error('Expected an array of authors but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };



    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const setIntro = (value) => {
    setPost((prevPost) => ({
      ...prevPost,
      intro: value,
    }));
  };

  const setBody = (value) => {
    setPost((prevPost) => ({
      ...prevPost,
      body: value,
    }));
  };
  const handleOpenModal = () => {
    console.log('Opening modal');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setModalOpen(false);
  };

  const handleModalSubmit = async (data) => {
    console.log('handleModalSubmit called'); // Log when this function is called
    console.log('Data received from modal:', data); // Log the received data

    const { images, inputField1, inputField2 } = data;

    // Check if images are received correctly
    if (!images || images.length === 0) {
      console.error('No images received');
      return;
    }

    // Upload each image and get their IDs
    const imageIds = await Promise.all(
      images.map(image => handleImageUpload(image)) // Assuming handleImageUpload is defined
    );

    // Log the image IDs
    console.log('Uploaded Image IDs:', imageIds);

    // Update the post state with the image IDs and input fields
    setPost((prevPost) => ({
      ...prevPost,
      images: [...prevPost.images, ...imageIds], // Save the image IDs in the post state
      // You can also add inputField1 and inputField2 to the post state if needed
       // Add this if you want to store it in the post state
    }));

    handleCloseModal(); // Close the modal after submission
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
      return response.data.id; // Assuming the response contains the image ID
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
      return null;
    }
  };

  const handleCategorySelect = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const handleAddCategory = () => {


      setPost((prevPost) => ({
        ...prevPost,
        categoriesId: [...prevPost.categoriesId, selectedCategoryId],
      }));
      setSelectedCategoryId(''); // Reset the selected category after adding

  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload all images and get their URLs
    const imageUrls = await Promise.all(
      uploadedImageId.map(file => handleImageUpload(file))
    );

    const validImageUrls = imageUrls.filter(url => url);
    console.log("Uploaded image URLs:", imageUrls);

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('intro', post.intro);
    formData.append('body', post.body);
    formData.append('status', post.status); // Add status to form data
    formData.append('url', post.url); // Add URL to form data
    formData.append('meta_title', post.meta_title); // Add Meta Title to form data
    formData.append('keywords', post.keywords); // Add Keywords to form data
    formData.append('schema_markup', post.schema_markup); // Add Schema Markup to form data
    formData.append('author_id', post.authorId);

    post.categoriesId.forEach((catId) => {
      formData.append('categories_id[]', catId);
    });


    validImageUrls.forEach((url) => {
      formData.append('images[]', url);
    });



    try {
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      const response = await axiosClient.post('/posts', formData, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('ACCESS_TOKEN')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Post created:', response.data);
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: (acceptedFiles) => {
      setUploadedImageId((prevImages) => [
        ...prevImages,
        ...acceptedFiles,
      ]);
    },
  });

  return (
    <div className="admin-dashboard">
      <form onSubmit={handleSubmit} className="postForm">
        <h2>Add a New Post</h2>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          placeholder="Post Title"
          required
          className="inputField"
        />
        <h2>Post Intro</h2>
        <CustomHtmlEditor
          onChange={setIntro}
          uploadUrl={uploadUrl}
          height="130px"
          style={{marginBottom: '20px'}}
        />
        <h2>Post Body</h2>
        <CustomHtmlEditor
          onChange={setBody}
          uploadUrl={uploadUrl}
          height="400px"
          style={{marginBottom: '20px'}}
        />
        <label>
          Author:&nbsp;&nbsp;&nbsp;
          <select
            name="authorId"
            value={post.authorId}
            onChange={handleChange}
            className="inputField"
          >
            <option value="">Select Author</option>
            {availableAuthors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.title}
              </option>
            ))}
          </select>
        </label>&nbsp;&nbsp;&nbsp;
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

        &nbsp;&nbsp;&nbsp;
        <label>
          Status:&nbsp;&nbsp;&nbsp;
          <select
            name="status"
            value={post.status}
            onChange={handleChange}
            className="inputField"
          >
            <option value="draft">Draft</option>
            <option value="private">Private</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label>
          <br/>
          URL:
          <input
            type="text"
            name="url"
            value={post.url}
            onChange={handleChange}
            placeholder="Post URL"
            required
            className="inputField"
          />
        </label>
        <label>
          Meta Title:
          <input
            type="text"
            name="meta_title"
            value={post.meta_title}
            onChange={handleChange}
            placeholder="Meta Title"
            className="inputField"
          />
        </label>
        <label>
          Keywords:
          <input
            type="text"
            name="keywords"
            value={post.keywords}
            onChange={handleChange}
            placeholder="Keywords"
            className="inputField"
          />
        </label>
        <label>
          Schema Markup:
          <br/>
          <textarea
            name="schema_markup"
            value={post.schema_markup}
            onChange={handleChange}
            placeholder="Schema Markup"
            className="inputField"
          />
        </label>
        <h3>Featured Image</h3>

        <button onClick={handleOpenModal} className="openModalButton">Add Image and Fields</button>
        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
        <button type="submit" className="submitButton">Submit Post</button>
      </form>
    </div>
  );
};

export default AddPost;
