import {Link, useNavigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider";
import axiosClient from "../axios-client.js";
import {useEffect, useState} from "react";
import axios from 'axios';

export default function DefaultLayout() {
  const {user, isAdmin, setIsAdmin, token, setUser, setToken, notification} = useStateContext();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAdmin) {
        try {
          const response = await axiosClient.get('/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAdmin(response.data.is_admin);
          // Update isAdmin based on the response
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/recipes'); // Redirect if unable to fetch user data
        }
      }
    };

    checkAdminStatus();

    // Fetch recipes (GET all recipes when visiting "Products" page)
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/recipes/all');
        setRecipes(response.data.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, [isAdmin, navigate, token, setIsAdmin]);


  const onLogout = e => {
    e.preventDefault()

    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        if (JSON.stringify(data) !== JSON.stringify(user)) {
          setUser(data);
        }
      });
  }, []);

  return (
    <div id="defaultLayout">
      <aside>
        {user.name}
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add-post">Add Post</Link>
        <Link to="/add-product">Add Product</Link>
        <Link to="/add-author">Add Author</Link>
        <Link to="/add-post-category">Add Post Category</Link>
        <Link to="/add-product-category">Add Product Category</Link>
        <a onClick={onLogout} className="btn-logout" href="#">Logout</a>


      </aside>
      <div className="content">

        <main>
          <Outlet/>
        </main>
        {notification &&
          <div className="notification">
            {notification}
          </div>
        }
      </div>
    </div>
  )
}
