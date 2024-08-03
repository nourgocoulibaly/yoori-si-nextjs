import { app } from '@/lib/firebaseConfig'; // Assurez-vous d'avoir configuré Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const auth = getAuth(app);
const db = getFirestore(app);

interface User {
    role: string;
    // Ajoutez d'autres propriétés utilisateur si nécessaire
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    setUser({ role: 'user', ...userDoc.data() } as User);
                } else {
                    const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
                    if (adminDoc.exists()) {
                        setUser({ role: 'admin', ...adminDoc.data() } as User);
                    } else {
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}