"use client"

import * as React from "react";
import { useEffect, useState } from "react"; // Ajoutez cette ligne

import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import { useRouter } from 'next/navigation';
import UserDashboardContent from "./_components/content";
import UserNavBar from "./_components/navbar";

function UserDashboardPage() {
    const [isClient, setIsClient] = useState(false);
    const { user, loading } = useAuth();
    const router = useRouter();
    const [progress, setProgress] = useState(13) // Modifiez cette ligne



    React.useEffect(() => {
        const timer = setTimeout(() => setProgress(66), 500)
        return () => clearTimeout(timer)
      }, [])

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
        return <div><Progress value={progress} className="w-[100%]" /></div>; // ou un loader, ou un message d'attente
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