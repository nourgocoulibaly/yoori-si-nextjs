"use client";

import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebaseConfig";
import { User, getAuth, onAuthStateChanged, signOut, updatePassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import Progress from "@/tools/progress";

const Account = () => {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<{
		uid: string;
		email: string;
		lastName: string;
		firstName: string;
		pseudo?: string;
		direction?: string;
		location?: string;
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
	const [isUpdating, setIsUpdating] = useState(false);

	const { toast } = useToast();

	const handleUpdate = async () => {
		setIsUpdating(true);
		if (user) {
			const userDocRef = doc(db, "admins", user.uid);
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
				setUserData({
					uid: user.uid,
					email: newEmail || (userData?.email ?? ""),
					lastName: newLastName || (userData?.lastName ?? ""),
					firstName: newFirstName || (userData?.firstName ?? ""),
					pseudo: newPseudo,
					direction: newDirection,
					location: newLocation,
				});
			} catch (error) {
				console.error("Erreur lors de la mise à jour des informations:", error);
			}
		}
		setIsUpdating(false);
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
				const userDocRef = doc(db, "admins", user.uid);
				const userDoc = await getDoc(userDocRef);
				if (userDoc.exists()) {
					const data = userDoc.data() as {
						email: string;
						lastName: string;
						firstName: string;
						pseudo?: string;
						direction?: string;
						location?: string;
					};
					setUserData({
						uid: user.uid,
						email: data.email,
						lastName: data.lastName,
						firstName: data.firstName,
						pseudo: data.pseudo,
						direction: data.direction,
						location: data.location,
					});
				} else {
					console.log("Aucune donnée utilisateur trouvée pour l'UID:", user.uid);
				}
			} else {
				console.log("Utilisateur non connecté");
				router.push("/auth");
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth, router]);

	if (loading) {
		return <div><Progress /></div>;
	}

	if (!userData) {
		return <p>Aucune donnée utilisateur disponible.</p>;
	}

	return (
		<div>
			<main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
				<div className='flex items-center'>
					<h1 className='text-lg font-semibold md:text-2xl'>
						Bienvenue, {userData.lastName} {userData.firstName}
					</h1>
				</div>

				<div className='flex flex-col gap-4'>
					<div>
						<Card>
								<CardHeader>
									<CardTitle>mon Compte</CardTitle>
									<CardDescription>
										Retrouver toutes vos informations de compte. 
								</CardDescription>
								</CardHeader>
								<CardContent>
									<form className="flex flex-col items-center gap-4">
										<div className="flex flex-col items-center space-y-2 w-full max-w-[700px]">
											<label
													htmlFor="email"
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													Votre Email
											</label>
											<Input id="email" placeholder="Votre email" defaultValue={userData.email} className="w-full" />
										</div>
										<div className="flex flex-col items-center space-y-2 w-full max-w-[700px]">
											<label
													htmlFor="pseudo"
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													Votre Pseudo
												</label>
											<Input id="pseudo" placeholder="Votre Pseudo" defaultValue={userData.pseudo} className="w-full" />
										</div>
										<div className="flex flex-col items-center space-y-2 w-full max-w-[700px]">
											<label
													htmlFor="direction"
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													Votre Direction
											</label>
											<Input id="direction" placeholder="Votre Direction" defaultValue={userData.direction} className="w-full" />
										</div>
										<div className="flex flex-col items-center space-y-2 w-full max-w-[700px]">
											<label
													htmlFor="location"
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													Votre Localisation
											</label>
											<Input id="location" placeholder="Votre Localisation" defaultValue={userData.location} className="w-full" />
										</div>
									</form>
								</CardContent>
						</Card>
					</div>
					<div>
						<Card>
							<CardHeader>
								<CardTitle>Modifier vos informations</CardTitle>
								<CardDescription>
									Used to identify your store in the marketplace.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form className="flex flex-col items-center gap-4">
								<Input
									type='text'
									placeholder='Nouveau prénom'
									value={newFirstName}
									onChange={(e) => setNewFirstName(e.target.value)}
									className='w-full max-w-[700px]'
								/>
								<Input
								type='text'
								placeholder='Nouveau nom'
								value={newLastName}
								onChange={(e) => setNewLastName(e.target.value)}
								className='w-full max-w-[700px]'
							/>
							<Input
								type='email'
								placeholder='Nouvel email'
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								className='w-full max-w-[700px]'
							/>
							<Input
								type='text'
								placeholder='Nouveau pseudo'
								value={newPseudo}
								onChange={(e) => setNewPseudo(e.target.value)}
								className='w-full max-w-[700px]'
							/>
							<Input
								type='text'
								placeholder='Nouvelle direction'
								value={newDirection}
								onChange={(e) => setNewDirection(e.target.value)}
								className='w-full max-w-[700px]'
							/>
							<Input
								type='text'
								placeholder='Nouvelle localisation'
								value={newLocation}
								onChange={(e) => setNewLocation(e.target.value)}
								className='w-full max-w-[700px]'
							/>
							<Input
								type='password'
								placeholder='Nouveau mot de passe'
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className='w-full max-w-[700px]'
							/>
								</form>
							</CardContent>
							<CardFooter className="border-t px-6 py-4">
								<Button onClick={handleUpdate} className='btn-primary' disabled={isUpdating}>
									{isUpdating ? "Mise à jour..." : "Mettre à jour"}
								</Button>

								<Button size='lg' type="submit"
														variant="outline"
														onClick={() => {
															toast({
																title: "✅ Modification enregistrée avec succès !",
																description: "Cette action ne peut pas être annulée. Cela modifiera directement vos données du serveur.",
															})
														}}
													>
														Mettre à jour
											</Button>							
							</CardFooter>
						</Card>
					</div>
				</div>
				{/* <Button onClick={handleLogout} className='btn-primary'>Se déconnecter</Button> */}
			</main>
		</div>
	);
};

export default Account;
