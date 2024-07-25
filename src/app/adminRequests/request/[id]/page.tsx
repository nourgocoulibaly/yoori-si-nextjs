// src/app/adminRequests/request/[id]/page.tsx
import { db } from '@/lib/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import RequestPage from './index';

// Fonction pour générer les paramètres statiques (chemins dynamiques)
export async function generateStaticParams() {
    try {
        const docRef = collection(db, 'userRequests');
        const snapshot = await getDocs(docRef);
        const paths = snapshot.docs.map(doc => ({ id: doc.id }));
        return paths; // Juste les chemins, pas de propriété 'fallback'
    } catch (error) {
        console.error("Erreur lors de la récupération des paramètres statiques :", error);
        return []; // Retourner un tableau vide en cas d'erreur
    }
}

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
export default async function RequestPageWrapper({ params }: { params: { id: string } }) {
    const { id } = params;
    const data = await fetchData(id);

    if (!data) {
        // Gérer le cas où les données ne sont pas trouvées
        return {
            notFound: true,
        };
    }

    const interventionDate = data.interventionDate && typeof data.interventionDate.toDate === 'function' ? data.interventionDate.toDate() : null;
    const requestData = {
        ...data,
        interventionDate,
    };

    return <RequestPage data={requestData} params={{ id }} />;
}