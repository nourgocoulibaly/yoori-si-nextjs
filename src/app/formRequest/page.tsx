"use client"


import { useEffect } from "react";

import Progress from "@/tools/progress";

import UserNavBar from "@/app/userDashboard/_components/navbar";
import { AuthProvider } from "@/contexts/AuthContext"; // Assurez-vous que le chemin d'importation est correct
import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import { useRouter } from 'next/navigation';
import UserFormBeta from "./_components/userFormBeta";

function Page() { // Renommez la fonction en commençant par une majuscule
    const { user, loading } = useAuth();
    const router = useRouter();
   

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'user') {
                router.replace('/404');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div><Progress /></div>;
    }

    return (
        <AuthProvider>
            <UserNavBar>
                <UserFormBeta />
            </UserNavBar>
        </AuthProvider>
    );
}

export default Page; // Assurez-vous que l'exportation correspond au nouveau nom