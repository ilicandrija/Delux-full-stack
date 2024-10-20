import React, { useState, useEffect } from 'react';
import JednoJelo from './jednoJelo';
import axiosClient from "../axios-client.js";
import { Range } from 'react-range';
import './css/Recipes.css';

const Jela = () => {
  const [recipes, setRecipes] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState(null);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('');
  const [filter, setFilter] = useState('');
  const [prepTimeRange, setPrepTimeRange] = useState([0, 300]);
  const STEP = 5;
  const MIN = 0;
  const MAX = 300;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axiosClient.get('/recipes');
        setRecipes(response.data.data); // Assuming the structure you provided
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
    console.log(recipes);
  }, [recipes]);

  useEffect(() => {
    if (recipes && sortOrder) {
      let sortedRecipes = [...filteredRecipes];
      if (sortOrder === 'name-asc') {
        sortedRecipes.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOrder === 'name-desc') {
        sortedRecipes.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortOrder === 'prep-time-asc') {
        sortedRecipes.sort((a, b) => a.prep_time - b.prep_time);
      } else if (sortOrder === 'prep-time-desc') {
        sortedRecipes.sort((a, b) => b.prep_time - a.prep_time);
      }
      setFilteredRecipes(sortedRecipes);
    }
  }, [sortOrder, recipes, filteredRecipes]);

  // Handle filtering when filter or prep time range changes
  useEffect(() => {
    if (recipes) {
      let filtered = recipes.filter(recipe =>
        recipe.ingredients.some(ing => ing.name.includes(filter)) &&
        recipe.prep_time >= prepTimeRange[0] && recipe.prep_time <= prepTimeRange[1]
      );
      setFilteredRecipes(filtered);
    }
  }, [filter, prepTimeRange, recipes]);

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!recipes) {
    return <h1>Loading recipes...</h1>;
  }

  return (
    <div className="content">
      <div className="left-column">
        <h2>Filter and Sort</h2>
        <div>
          <label>Filter by Ingredient: </label>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Enter ingredient name"
          />
        </div>
        <div>
          <label>Sort by: </label>
          <select onChange={(e) => setSortOrder(e.target.value)}>
            <option value="">Select</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="prep-time-asc">Prep Time (Low to High)</option>
            <option value="prep-time-desc">Prep Time (High to Low)</option>
          </select>
        </div>
        <div>
          <label>Prep Time Range: {prepTimeRange[0]} - {prepTimeRange[1]} min</label>
          <Range
            step={STEP}
            min={MIN}
            max={MAX}
            values={prepTimeRange}
            onChange={(values) => setPrepTimeRange(values)}
            renderTrack={({ props, children }) => (
              <div {...props} style={{ height: '6px', background: '#ddd', borderRadius: '5px' }}>
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div {...props} style={{ height: '20px', width: '20px', borderRadius: '50%', backgroundColor: 'white', border: '2px solid black' }} />
            )}
          />
        </div>
      </div>
      <div className="right-column">
        <div className="recipe-list">
          {filteredRecipes === null ? (
            <h1>Loading recipes...</h1>
          ) : (
            filteredRecipes.map((recipe) => (
              <JednoJelo key={recipe.id} recipe={recipe} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Jela;
