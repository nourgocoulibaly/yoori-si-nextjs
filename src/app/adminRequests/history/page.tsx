'use client'

import { useEffect } from "react"; // Ajoutez cette ligne

import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import Progress from "@/tools/progress";
import { useRouter } from 'next/navigation';
import AdminNavBar from "../../adminDashboard/_components/navbar"; // Change the import path
import RequestHistory from "./_components/history";

export default function AdminRequestsHistoryPage() {
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
        return <div><Progress /></div>;
    }

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <AdminNavBar>
                <RequestHistory />
            </AdminNavBar>
        </div>
    );
}