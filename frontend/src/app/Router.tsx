import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../pages/Applayout";
import { DashboardPage } from "../pages/Dashboard";
import { ServicesPage } from "../pages/Services";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {index: true, element: <DashboardPage />},
            {path: 'services', element: <ServicesPage />}
        ]
    }
])