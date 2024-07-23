"use client";

import { useAuth } from "@/contexts/AuthContext";

import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
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

export default function Signup() {
	const emailRef = useRef<HTMLInputElement>(null);
	const directionRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const passwordConfirmRef = useRef<HTMLInputElement>(null);
	const firstNameRef = useRef<HTMLInputElement>(null);
	const lastNameRef = useRef<HTMLInputElement>(null);
	const { signup } = useAuth();
	const router = useRouter();
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

		if (password !== passwordConfirm) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}

		try {
			setError("");
			setLoading(true);
			const adminCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const admin = adminCredential.user;

			// Afficher l'utilisateur actuel dans la console
			console.log("Utilisateur actuel:", admin);

			// Stocker des informations supplémentaires dans Firestore
			await setDoc(doc(db, "admins", admin.uid), {
				firstName: firstName,
				lastName: lastName,
				email: email,
				direction: direction,
			});

			console.log("Redirection vers /dashboard");
			router.push("/adminDashboard");
		} catch (error: any) {
			console.error(
				"Erreur lors de l'inscription ou de la sauvegarde des données:",
				error
			);
			setError("Échec de la création du compte: " + error.message);
		}
		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card className='mx-auto max-w-sm'>
				<CardHeader>
					<CardTitle className='text-xl'>S&apos;inscrire</CardTitle>
					<CardDescription>
						Entrez vos informations pour créer un compte{" "}
						{error && <p className='red'>{error}</p>}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='first-name'>Prénom</Label>
								<Input
									id='first-name'
									placeholder='Max'
									ref={firstNameRef}
									required
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='last-name'>Nom</Label>
								<Input
									id='last-name'
									placeholder='Robinson'
									ref={lastNameRef}
									required
								/>
							</div>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Direction/Service</Label>
							<Input
								id='direction'
								type='text'
								ref={directionRef}
								placeholder='DMISSA/DDU'
								required
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								ref={emailRef}
								placeholder='m@example.com'
								required
							/>
						</div>
						<div className='grid gap-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='grid gap-2'>
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
