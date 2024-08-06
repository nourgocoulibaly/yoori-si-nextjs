import { collection, getDocs, getFirestore } from "firebase/firestore";

export async function getUserList() {
  const db = getFirestore();
  const usersCollection = collection(db, 'admins');
  const usersSnapshot = await getDocs(usersCollection);
  const usersData = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  return usersData;
}
