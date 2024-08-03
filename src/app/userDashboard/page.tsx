"use client"

import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserDashboardContent from "./_components/content";
import UserNavBar from "./_components/navbar";

function UserDashboardPage() {
    const [isClient, setIsClient] = useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'user') {
                router.replace('/404');
            }
        }
    }, [user, loading, router]);

    if (!isClient || loading) {
        return <div>Chargement...</div>; // ou un loader, ou un message d'attente
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