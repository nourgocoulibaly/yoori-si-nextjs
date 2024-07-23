import { db } from '@/lib/firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import RequestPage from '.';

export async function generateStaticParams() {
    try {
        const docRef = collection(db, 'userRequests');
        const snapshot = await getDocs(docRef);
        const paths = snapshot.docs.map(doc => ({ id: doc.id }));
        return paths;
    } catch (error) {
        console.error("Erreur lors de la récupération des paramètres statiques :", error);
        return []; // Retourner un tableau vide en cas d'erreur
    }
}

export async function getData(id: string) {
    try {
        const docRef = doc(db, 'userRequests', id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return null; // Retourner null en cas d'erreur
    }
}

export default function Requests({ params, data }: { params: { id: string }, data?: any }) { // Ajouter 'params' comme propriété obligatoire
    return (
        <RequestPage data={data} params={params} />
    );
}