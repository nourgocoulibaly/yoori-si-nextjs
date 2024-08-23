"use client"

import Progress from "@/tools/progress";
import { useEffect } from "react";

import AdminNavbar from "@/app/adminDashboard/_components/navbar";
import { useAuth } from '@/contexts/useAuth'; // Assurez-vous d'avoir ce hook
import { useRouter } from 'next/navigation';
import ChatBot from "./_components/chatbot";

function ChatBotPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
   

    // useEffect(() => {
    //     if (!loading) {
    //         if (!user || user.role !== 'admin') {
    //             router.replace('/404');
    //         }
    //     }
    // }, [user, loading, router]);

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
        <div>
            <AdminNavbar>
                <ChatBot />
            </AdminNavbar>
        </div>
    );
}

export default ChatBotPage;