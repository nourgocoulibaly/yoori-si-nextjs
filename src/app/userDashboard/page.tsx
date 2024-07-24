"use client"

import { useEffect, useState } from 'react';
import UserDashboardContent from "./_components/content";
import UserNavBar from "./_components/navbar";

function UserDashboardPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // ou un loader, ou un message d'attente
    }

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <UserNavBar>
                <UserDashboardContent />
            </UserNavBar>
        </div>
    );
}

export default UserDashboardPage;