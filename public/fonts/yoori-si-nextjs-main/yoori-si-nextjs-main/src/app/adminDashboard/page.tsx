"use client"

import { useEffect } from 'react';
import AdminDashboardContent from "./_components/content";
import AdminNavBar from "./_components/navbar";
// import SidebarDemo from "./_components/sidebar";

export default function AdminDashboard() {
    useEffect(() => {
        // Code qui accède à `document`
        if (typeof document !== 'undefined') {
            console.log(document.title);
        }
    }, []);

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <AdminNavBar>
            {/* <SidebarDemo> */}
                <AdminDashboardContent />
            {/* </SidebarDemo> */}
            </AdminNavBar>
        </div>
    );
}