'use client'

import { useEffect } from 'react';
import AdminNavBar from "../../adminDashboard/_components/navbar"; // Change the import path
import RequestHistory from "./_components/history";


export default function AdminRequestsHistoryPage() {
    useEffect(() => {
        // Code qui accède à `document`
        if (typeof document !== 'undefined') {
            console.log(document.title);
        }
    }, []);

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <AdminNavBar>
                <RequestHistory />
            </AdminNavBar>
        </div>
    );
}