import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";

export function AppLayout() {
    return(
        <div className="flex h-screen bg-[#0e1014] text-[#e8eaf0] overflow-hidden">
            <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
            <Outlet />
        </main>
        </div>
    )
}