"use client";

import { useAuth } from "@/contexts/AuthContext";

import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupProps {
  updateProfile: (user: User, displayName: string) => Promise<void>;
}

export default function Signup({ updateProfile }: SignupProps) {
	const emailRef = useRef<HTMLInputElement>(null);
	const directionRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmRef = useRef<HTMLInputElement>(null);
	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const pseudoRef = useRef<HTMLInputElement>(null);
	const tourRef = useRef<HTMLInputElement>(null);
	const etagePorteRef = useRef<HTMLInputElement>(null);
	const phoneNumberRef = useRef<HTMLInputElement>(null);
	const { signup } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (loading) return;

		const email = emailRef.current?.value || "";
		const direction = directionRef.current?.value || ""; 
		const password = passwordRef.current?.value || "";
		const passwordConfirm = passwordConfirmRef.current?.value || "";
		const firstName = firstNameRef.current?.value || "";
		const lastName = lastNameRef.current?.value || "";
		const pseudo = pseudoRef.current?.value || "";
		const localisationTour = tourRef.current?.value || "";
		const localisationEtagePorte = etagePorteRef.current?.value || "";
		const phoneNumber = phoneNumberRef.current?.value || "";

		if (password !== passwordConfirm) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}

		try {
			setError("");
			setLoading(true);

			// Vérifier si le pseudo est déjà utilisé
			const pseudoQuery = query(collection(db, "admins"), where("pseudo", "==", pseudo));
			const pseudoQuerySnapshot = await getDocs(pseudoQuery);
			if (!pseudoQuerySnapshot.empty) {
				throw new Error("Ce pseudo est déjà utilisé. Veuillez en choisir un autre.");
			}

			const adminCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const admin = adminCredential.user;

			// Stocker des informations supplémentaires dans Firestore
			await setDoc(doc(db, "admins", admin.uid), {
				firstName: firstName,
				lastName: lastName,
				email: email,
				direction: direction,
				pseudo: pseudo,
				localisationTour: localisationTour,
				localisationEtagePorte: localisationEtagePorte,
				phoneNumber: phoneNumber
			});

			console.log("🤖Données stockées dans Firestore pour UID:", admin.uid);

			// Utiliser la fonction updateProfile passée en prop
			await updateProfile(admin, pseudo);

			router.push(`/adminDashboard`); // Utilisation d'une route dynamique
		} catch (error: any) {
			console.error(
				"🤖Erreur lors de l'inscription ou de la sauvegarde des données:",
				error
			);
			switch(error.code) {
				case 'auth/operation-not-allowed':
					setError("Cette méthode d'authentification n'est pas activée. Veuillez contacter l'administrateur.");
					break;
				case 'auth/api-key-not-valid':
					setError("Erreur de configuration Firebase. Veuillez contacter l'administrateur.");
					break;
				case 'auth/email-already-in-use':
					setError("Cette adresse email est déjà utilisée.");
					break;
				case 'auth/weak-password':
					setError("Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.");
					break;
				default:
					setError("Échec de la création du compte: " + (error.message || "Erreur inconnue"));
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card className='mx-auto max-w-sm'>
				<CardHeader>
					<CardTitle className='text-xl'>S&apos;inscrire</CardTitle>
					<CardDescription>
						Entrez vos informations pour créer un compte{" "}
						{error && <p className='text-red-500 font-bold mt-2'>{error}</p>}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='first-name'>Prénom</Label>
								<Input
									id='first-name'
									placeholder='Ex: Max'
									ref={firstNameRef}
									required
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='last-name'>Nom</Label>
								<Input
									id='last-name'
									placeholder='Ex: Robinson'
									ref={lastNameRef}
									required
								/>
							</div>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='direction'>Direction/Service</Label>
							<Input
								id='direction'
								type='text'
								ref={directionRef}
								placeholder='Ex: DMISSA'
								required
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								ref={emailRef}
								placeholder='Ex: max@example.com'
								required
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='pseudo'>Pseudo</Label>
							<Input
								id='pseudo'
								type='text'
								ref={pseudoRef}
								placeholder='Ex: MaxRobinson'
								required
							/>
						</div>
						<div className='grid gap-2'>
							<Label>Localisation</Label>
							<div className='grid grid-cols-2 gap-4'>
								<div className='grid gap-2'>
									<Label htmlFor='localisationTour'>localisationTour</Label>
									<Input
										id='localisationTour'
										type='text'
										ref={tourRef}
										placeholder='Ex: SIGFU'
										required
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='etage-porte'>Étage/Porte</Label>
									<Input
										id='etage-porte'
										type='text'
										ref={etagePorteRef}
										placeholder='Ex: Equipe IT'
										required
									/>
								</div>
							</div>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='phone-number'>Numéro de téléphone</Label>
							<Input
								id='phone-number'
								type='tel'
								ref={phoneNumberRef}
								placeholder='Ex: 0123456789'
								required
							/>
						</div>
						<div className='grid gap-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='mt-4 grid gap-2'>
									<Label htmlFor='password'>Mot de passe</Label>
									<Input
										id='password'
										type='password'
										placeholder='Mot de passe'
										ref={passwordRef}
										required
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='password-confirm'>
										Confirmez le mot de passe
									</Label>
									<Input
										id='password-confirm'
										type='password'
										placeholder='Confirmer Mot de Passe'
										ref={passwordConfirmRef}
										required
									/>
								</div>
							</div>
						</div>
						<Button type='submit' className='w-full' disabled={loading}>
							{loading ? "Création du Compte..." : "Créer un compte"}
						</Button>
						<Button variant='outline' className='w-full' disabled={loading}>
							Inscrivez-vous avec GitHub
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}