import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from 'date-fns';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

const db = getFirestore();

const filterByWeek = async (timestamp: number) => {
  const date = new Date(timestamp);
  const startDate = startOfWeek(date, { weekStartsOn: 1 });  // Lundi comme début de semaine
  const endDate = endOfWeek(date, { weekStartsOn: 1 });

  const q = query(
    collection(db, 'yourCollectionName'),
    where('createdAt', '>=', startDate.getTime()),
    where('createdAt', '<=', endDate.getTime())
  );

  const querySnapshot = await getDocs(q);
  const results = querySnapshot.docs.map(doc => doc.data());
  return results;
};


const filterByMonth = async (timestamp: number) => {
  const date = new Date(timestamp);
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);

  const q = query(
    collection(db, 'yourCollectionName'),
    where('createdAt', '>=', startDate.getTime()),
    where('createdAt', '<=', endDate.getTime())
  );

  const querySnapshot = await getDocs(q);
  const results = querySnapshot.docs.map(doc => doc.data());
  return results;
};



const filterByYear = async (timestamp: number) => {
  const date = new Date(timestamp);
  const startDate = startOfYear(date);
  const endDate = endOfYear(date);

  const q = query(
    collection(db, 'userRequests'),
    where('createdAt', '>=', startDate.getTime()),
    where('createdAt', '<=', endDate.getTime())
  );

  const querySnapshot = await getDocs(q);
  const results = querySnapshot.docs.map(doc => doc.data());
  return results;
};





