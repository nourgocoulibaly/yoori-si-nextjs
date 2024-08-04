// src/app/adminRequests/request/[id]/page.tsx
"use client";

import { db } from '@/lib/firebaseConfig';
import { DocumentData, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import RequestPage from './index';

import Progress from "@/tools/progress";

// Fonction pour obtenir les données en fonction de l'ID
async function fetchData(id: string) {
    try {
        const docRef = doc(db, 'userRequests', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return null;
    }
}

// Composant de page principal
export default function RequestPageWrapper({ params }: { params: { id: string } }) {
    const [data, setData] = useState<null | DocumentData>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const fetchedData = await fetchData(params.id);
            setData(fetchedData as DocumentData | null);
            setLoading(false);
        }
        loadData();
    }, [params.id]);

    if (loading) {
        return <div><Progress /></div>;
    }

    if (!data) {
        // Gérer le cas où les données ne sont pas trouvées
        return <div>Demande non trouvée</div>;
    }

    const interventionDate = data.interventionDate && typeof data.interventionDate.toDate === 'function' ? data.interventionDate.toDate() : null;
    const requestData = {
        ...data,
        interventionDate,
    };

    return <RequestPage data={requestData} params={{ id: params.id }} />;
}