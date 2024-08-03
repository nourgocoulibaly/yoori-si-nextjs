"use client"

import { useEffect } from 'react';
import AdminNavbar from "../adminDashboard/_components/navbar";
import { AdminInventory } from "./_components/adminInventory";


function AdminInventoryPage() {
    useEffect(() => {
        // Code qui accède à `document`
        if (typeof document !== 'undefined') {
            console.log(document.title);
        }
    }, []);

    return (
        <div>
            <AdminNavbar>
                <AdminInventory />
            </AdminNavbar>
        </div>
    );
}

export default AdminInventoryPage;