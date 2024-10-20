import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {useEffect} from "react";
import axiosClient from "../axios-client.js";
import AdminNavBar from "../views/AdminNavBar.jsx";
import '../views/css/Recipes.css';
export default function GuestLayout(){
  const {token} = useStateContext()
  if(token){
    return <Navigate to="/"/>
  }



   return(
     <div className="admin-dashboard">
       <AdminNavBar/>

       <div className="content">
         <Outlet/>

       </div>
     </div>
   )
}
