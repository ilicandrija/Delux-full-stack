import React, { useState } from 'react';
import axios from 'axios';
import axiosClient from "../axios-client.js";

const IngredientForm = () => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    console.log(name,unit);

    try {
      // Retrieve the token from local storage
      const response = await axiosClient.post('/ingredients', {
        name,
        unit,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`, // Include the token in the request headers
        },
      });
      setSuccess('Ingredient created successfully!');
      setName('');
      setUnit('');
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
      <h2>Create Ingredient</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Unit:</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>
        <button type="submit">Create Ingredient</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default IngredientForm;
