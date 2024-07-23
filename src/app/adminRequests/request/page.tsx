"use client"

import { db } from '@/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fonction pour récupérer les requêtes depuis Firestore
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, 'userRequests'));
      const requestsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData); // Mettre à jour l'état avec les données récupérées
    };
    fetchRequests(); // Appeler la fonction de récupération des requêtes
  }, []);

  // Fonction de redirection vers la page de détails de la requête
  const handleRedirect = (id: string) => {
    router.push(`/adminRequests/request/${id}`);
  };

  return (
    <div>
      <h1>Admin Requests</h1>
      <ul>
        {requests.map(request => (
          <li key={request.id}>
            <span>{request.userName}</span>
            <button onClick={() => handleRedirect(request.id)}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRequests;
