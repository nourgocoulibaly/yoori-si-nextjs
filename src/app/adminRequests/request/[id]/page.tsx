// src/app/adminRequests/request/[id]/page.tsx
import { db } from '@/lib/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import RequestPage from './index';

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

// Fonction pour générer les paramètres statiques
export async function generateStaticParams() {
    const ids = await getAllRequestIds();
    return ids.map((id) => ({
        id,
    }));
}

// Fonction pour récupérer tous les IDs
async function getAllRequestIds() {
    try {
        const querySnapshot = await getDocs(collection(db, 'userRequests'));
        return querySnapshot.docs.map(doc => doc.id);
    } catch (error) {
        console.error("Erreur lors de la récupération des IDs :", error);
        return [];
    }
}

// Composant de page principal
export default async function RequestPageWrapper({ params }: { params: { id: string } }) {
    const { id } = params;
    const data = await fetchData(id);

    if (!data) {
        // Gérer le cas où les données ne sont pas trouvées
        return <div>Demande non trouvée</div>;
    }

    const interventionDate = data.interventionDate && typeof data.interventionDate.toDate === 'function' ? data.interventionDate.toDate() : null;
    const requestData = {
        ...data,
        interventionDate,
    };

    return <RequestPage data={requestData} params={{ id }} />;
}