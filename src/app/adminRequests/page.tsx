"use client"

import { Progress } from "@/components/ui/progress";
import * as React from "react";
import { useEffect, useState } from "react";

import AdminNavbar from "@/app/adminDashboard/_components/navbar";
import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import { useRouter } from 'next/navigation';
import AdminRequests from "./_components/adminRequestsBeta";

function AdminRequestsPage() {
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
        <div>
            <AdminNavbar>
                <AdminRequests />
            </AdminNavbar>
        </div>
    );
}

export default AdminRequestsPage;