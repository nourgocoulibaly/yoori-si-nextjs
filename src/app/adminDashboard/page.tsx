"use client"

import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminDashboardContent from "./_components/content";
import AdminNavBar from "./_components/navbar";

function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                router.replace('/404');
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Code qui accède à `document`
        if (typeof document !== 'undefined') {
            console.log(document.title);
        }
    }, []);

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <AdminNavBar>
                <AdminDashboardContent />
            </AdminNavBar>
        </div>
    );
}

export default AdminDashboard;