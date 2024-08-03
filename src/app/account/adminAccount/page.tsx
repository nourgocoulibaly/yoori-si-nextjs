"use client"

import AdminNavBar from "@/app/adminDashboard/_components/navbar";
import { useEffect, useState } from 'react';
import Account from "./_components/accountDetail";

function AccountPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // ou un loader, ou un message d'attente
    }

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <AdminNavBar>
                <Account />
            </AdminNavBar>
        </div>
    );
}

export default AccountPage;