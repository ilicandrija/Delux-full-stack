import React, { useState } from 'react';
import axiosClient from "../axios-client.js";

const PostCategoryForm = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [body, setBody] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [schemaMarkup, setSchemaMarkup] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosClient.post('/post_categories', {
        url,
        title,
        intro,
        body,
        featured_image: featuredImage,
        meta_title: metaTitle,
        meta_description: metaDescription,
        keywords,
        schema_markup: schemaMarkup,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
        },
      });
      setSuccess('Post Category created successfully!');
      // Reset fields
      setUrl('');
      setTitle('');
      setIntro('');
      setBody('');
      setFeaturedImage('');
      setMetaTitle('');
      setMetaDescription('');
      setKeywords('');
      setSchemaMarkup('');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'An error occurred');
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('Error: ' + err.message);
      }
    }
  };

  return (
    <div>
      <h2>Create Post Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Intro:</label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Body:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Featured Image URL:</label>
          <input
            type="text"
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
          />
        </div>
        <div>
          <label>Meta Title:</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Meta Description:</label>
          <input
            type="text"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Keywords:</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <div>
          <label>Schema Markup:</label>
          <textarea
            value={schemaMarkup}
            onChange={(e) => setSchemaMarkup(e.target.value)}
          />
        </div>
        <button type="submit">Create Post Category</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default PostCategoryForm;
