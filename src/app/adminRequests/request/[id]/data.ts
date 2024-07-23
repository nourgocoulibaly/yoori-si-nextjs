import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export async function generateStaticParams() {
    try {
        const docRef = collection(db, 'userRequests');
        const snapshot = await getDocs(docRef);
        const paths = snapshot.docs.map(doc => ({ id: doc.id }));
        return paths.map(path => ({ params: { id: path.id } }));
    } catch (error) {
        console.error("Erreur lors de la récupération des paramètres statiques :", error);
        return [];
    }
}
