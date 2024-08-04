"use client"

import Progress from "@/tools/progress";
import { useEffect } from "react";

import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import { useRouter } from 'next/navigation';
import AdminNavBar from "../../adminDashboard/_components/navbar"; // Change the import path
import RequestForm from "./_components/requestForm";

export default function RequestFormPage() {
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
                <RequestForm />
            </AdminNavBar>
        </div>
    );
}