"use client"

import { useEffect } from 'react';
import AdminNavBar from "../../adminDashboard/_components/navbar"; // Change the import path
import RequestForm from "./_components/requestForm";

export default function RequestFormPage() {
    useEffect(() => {
        // Code qui accède à `document`
        if (typeof document !== 'undefined') {
            console.log(document.title);
        }
    }, []);

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <AdminNavBar>
                <RequestForm />
            </AdminNavBar>
        </div>
    );
}