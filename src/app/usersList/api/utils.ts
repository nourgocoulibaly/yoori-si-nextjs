import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";

export async function getUserList() {
	const auth = getAuth();
	const currentUser = auth.currentUser;

	if (!currentUser) {
		throw new Error("L'utilisateur n'est pas authentifié");
	}

	try {
		const db = getFirestore();
		const usersCollection = collection(db, "users");
		const usersSnapshot = await getDocs(usersCollection);
		const usersData = usersSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return usersData;
	} catch (error) {
		console.error(
			"Erreur lors de la récupération de la liste des utilisateurs:",
			error
		);
		throw new Error(
			"Impossible de récupérer la liste des utilisateurs. Vérifiez vos permissions."
		);
	}
}
