"use client"

import AdminNavbar from "@/app/adminDashboard/_components/navbar";
import { useEffect } from 'react';
import AdminRequests from "./_components/adminRequestsBeta";


function AdminRequestsPage() {
    useEffect(() => {
        // Code qui accède à `document`
        if (typeof document !== 'undefined') {
            console.log(document.title);
        }
    }, []);

    return (
        <div>
            <AdminNavbar>
                <AdminRequests />
            </AdminNavbar>
        </div>
    );
}

export default AdminRequestsPage;