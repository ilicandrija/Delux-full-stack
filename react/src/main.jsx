import './index.css'
import {RouterProvider} from "react-router-dom";
import router from "./router.jsx";
import React from 'react'
import { createRoot } from 'react-dom/client'
import {ContextProvider} from "./contexts/ContextProvider.jsx";


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
    <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
)
