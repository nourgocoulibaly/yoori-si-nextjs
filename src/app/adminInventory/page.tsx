"use client"

import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminNavbar from "../adminDashboard/_components/navbar";
import { AdminInventory } from "./_components/adminInventory";

function AdminInventoryPage() {
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
        <div>
            <AdminNavbar>
                <AdminInventory />
            </AdminNavbar>
        </div>
    );
}

export default AdminInventoryPage;