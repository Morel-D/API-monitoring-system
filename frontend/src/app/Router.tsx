import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../pages/Applayout";
import { DashboardPage } from "../pages/Dashboard";
import { ServicesPage } from "../pages/Services";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Resgister";
import { ProtectedRoute } from "./Protected";

export const router = createBrowserRouter([
      // Public -------------------------------------------------
    { path: '/login',    element: <LoginPage />    },
    { path: '/register', element: <RegisterPage /> },

    // Protected -------------------------------------------------
    {
        path: '/',
        element: (
            <ProtectedRoute>
            <AppLayout />
            </ProtectedRoute>
        ),
        children: [
            {index: true, element: <DashboardPage />},
            {path: 'services', element: <ServicesPage />}
        ]
    },

     
  //  Fallback -----------------------------------
  { path: '*', element: <Navigate to="/" replace /> },
])