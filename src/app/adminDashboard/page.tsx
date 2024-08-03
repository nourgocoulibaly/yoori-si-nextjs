"use client"

import * as React from "react";
import { useEffect, useState } from "react"; // Ajoutez cette ligne

import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import { useRouter } from 'next/navigation';
import AdminDashboardContent from "./_components/content";
import AdminNavBar from "./_components/navbar";

function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [progress, setProgress] = useState(13) // Modifiez cette ligne



    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
      }, [])

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
        return <div><Progress value={progress} className="w-[100%]" /></div>;
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