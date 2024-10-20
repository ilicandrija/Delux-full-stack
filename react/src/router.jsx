import {createBrowserRouter, Navigate} from "react-router-dom";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import Users from "./views/User.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Jela from "./views/Recipes.jsx";
import AddRecipe from "./views/addRecipe.jsx";
import IngredientForm from "./views/AddIngredient.jsx";
import Filter from "./views/Filter.jsx";
import AuthorForm from "./views/AddAuthor.jsx";
import ProductCategoryForm from "./views/AddProductCategory.jsx";
import PostCategoryForm from "./views/AddPostCategory.jsx";
import AddPost from "./views/AddPost.jsx";
import AddProduct from "./views/AddProduct.jsx";

const router= createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard"/>
      },
      {
        path: '/add-author',
        element: <AuthorForm />
      },
      {
        path: '/add-product-category',
        element: <ProductCategoryForm />
      },
      {
        path: '/add-post-category',
        element: <PostCategoryForm />
      },
      {
        path: '/add-post',
        element: <AddPost />
      },
      {
        path: '/add-product',
        element: <AddProduct />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },

      {
        path: '/add-recipe',
        element: <AddRecipe />
      },
      {
        path: '/add-ingredient',
        element: <IngredientForm />
      },
      {
        path: '/users',
        element: <Users />
      },

    ]
  },
  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },

      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/recipes',
        element: <Jela />
      },
      {
        path: '/filter',
        element: <Filter />
      },
    ]
  },

  {
    path: '*',
    element: <NotFound />
  },

])

export default router;

