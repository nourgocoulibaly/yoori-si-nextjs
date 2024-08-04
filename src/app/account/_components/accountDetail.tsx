// pages/account.tsx
"use client";

// import UserNavBar from "@/app/userDashboard/_components/navbar";
import { db } from "@/lib/firebaseConfig";
import { User, getAuth, onAuthStateChanged, signOut, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Progress from "@/tools/progress";


const Account = () => {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<{
		uid: string;
		email: string;
		lastName: string;
		firstName: string;
		pseudo?: string;
		direction?: string;  // Added direction property
		location?: string;  // Added location property
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const auth = getAuth();

	const [newEmail, setNewEmail] = useState("");
	const [newLastName, setNewLastName] = useState("");
	const [newFirstName, setNewFirstName] = useState("");
	const [newPseudo, setNewPseudo] = useState("");
	const [newDirection, setNewDirection] = useState("");
	const [newLocation, setNewLocation] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const handleUpdate = async () => {
		if (user) {
			const userDocRef = doc(db, "users", user.uid);
			try {
				await updateDoc(userDocRef, {
					email: newEmail || (userData?.email ?? ""),
					lastName: newLastName || (userData?.lastName ?? ""),
					firstName: newFirstName || (userData?.firstName ?? ""),
					pseudo: newPseudo,
					direction: newDirection,
					location: newLocation,
				});
				if (newPassword) {
					await updatePassword(user, newPassword);
				}
				console.log("Informations mises à jour avec succès");
				// Mettre à jour l'état local avec les nouvelles données
				setUserData({
					uid: user.uid,
					email: newEmail || (userData?.email ?? ""),
					lastName: newLastName || (userData?.lastName ?? ""),
					firstName: newFirstName || (userData?.firstName ?? ""),
				});
			} catch (error) {
				console.error("Erreur lors de la mise à jour des informations:", error);
			}
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			console.log("Déconnexion réussie");
			router.push("/");
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				console.log("Utilisateur connecté:", user);
				setUser(user);
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);
				if (userDoc.exists()) {
					const data = userDoc.data() as {
						email: string;
						lastName: string;
						firstName: string;
						pseudo?: string;
						direction?: string;  // Added direction property
						location?: string;  // Added location property
					};
					setUserData({
						uid: user.uid,
						email: data.email,
						lastName: data.lastName,
						firstName: data.firstName,
						pseudo: data.pseudo,
						direction: data.direction,  // Added direction property
						location: data.location,  // Added location property
					});
				} else {
					console.log(
						"Aucune donnée utilisateur trouvée pour l'UID:",
						user.uid
					);
				}
			} else {
				console.log("Utilisateur non connecté");
				router.push("/auth"); // Redirection vers la page d'authentification
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth, router]); // Ajout de router dans les dépendances

	if (loading) {
		return <div><Progress /></div>;
	}

	if (!userData) {
		return <p>Aucune donnée utilisateur disponible.</p>;
	}

	return (
		<div>
			{/* <UserNavBar> */}
				<main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
					<div className='flex items-center'>
						<h1 className='text-lg font-semibold md:text-2xl'>
							Bienvenue, {userData.lastName} {userData.firstName}
						</h1>
					</div>
					<div
						className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'
						x-chunk='dashboard-02-chunk-1'
					>
						<div className='flex flex-col items-center gap-1 text-center'>
							<h3 className='text-2xl font-bold tracking-tight'>Mon compte</h3>
							<p className='text-sm text-muted-foreground'>
								Email: {userData.email}
							</p>
							<button onClick={handleLogout}>Se déconnecter</button>
						</div>
					</div>
					<div className='flex flex-col gap-4'>
						<div>
							<label>Prénom actuel: {userData.firstName}</label>
							<input
								type='text'
								placeholder='Nouveau prénom'
								value={newFirstName}
								onChange={(e) => setNewFirstName(e.target.value)}
							/>
						</div>
						<div>
							<label>Nom actuel: {userData.lastName}</label>
							<input
								type='text'
								placeholder='Nouveau nom'
								value={newLastName}
								onChange={(e) => setNewLastName(e.target.value)}
							/>
						</div>
						<div>
							<label>Email actuel: {userData.email}</label>
							<input
								type='email'
								placeholder='Nouvel email'
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
							/>
						</div>
						<div>
							<label>Pseudo actuel: {userData.pseudo}</label>
							<input
								type='text'
								placeholder='Nouveau pseudo'
								value={newPseudo}
								onChange={(e) => setNewPseudo(e.target.value)}
							/>
						</div>
						<div>
							<label>Direction actuelle: {userData.direction}</label>
							<input
								type='text'
								placeholder='Nouvelle direction'
								value={newDirection}
								onChange={(e) => setNewDirection(e.target.value)}
							/>
						</div>
						<div>
							<label>Localisation actuelle: {userData.location}</label>
							<input
								type='text'
								placeholder='Nouvelle localisation'
								value={newLocation}
								onChange={(e) => setNewLocation(e.target.value)}
							/>
						</div>
						<div>
							<input
								type='password'
								placeholder='Nouveau mot de passe'
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
						<button onClick={handleUpdate}>Mettre à jour</button>
					</div>
				</main>
			{/* </UserNavBar> */}
		</div>
	);
};

export default Account;
