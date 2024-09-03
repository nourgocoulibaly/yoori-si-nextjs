6"use client";

import React from "react";

import Image from "next/image";


import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebaseConfig"; // Assurez-vous que le chemin est correct
import { ReloadIcon } from "@radix-ui/react-icons";
import { User } from "firebase/auth"; // Importez updateProfile depuis firebase/auth
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

import { KeySquare } from 'lucide-react';

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
import { Progress } from "@/components/ui/progress";

interface LoginProps {
  updateProfile: (user: User, displayName: string) => Promise<void>;
}

export default function Login({ updateProfile }: LoginProps) {
	const pseudoRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const { login } = useAuth();
	const router = useRouter();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [darkMode, setDarkMode] = React.useState(true);
	const [loginMethod, setLoginMethod] = useState<'email' | 'pseudo'>('email');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			
			const password = passwordRef.current?.value;
			if (!password) {
				throw new Error("Le mot de passe est requis");
			}

			let email: string | undefined;

			if (loginMethod === 'email') {
				email = emailRef.current?.value;
			} else {
				try {
					// Recherche de l'email associé au pseudo
					const adminQuery = query(collection(db, "admins"), where("pseudo", "==", pseudoRef.current?.value));
					const adminSnapshot = await getDocs(adminQuery);

					if (adminSnapshot.empty) {
						throw new Error("Aucun administrateur trouvé avec ce pseudo.");
					}

					const adminData = adminSnapshot.docs[0].data();
					email = adminData.email;

					if (!email) {
						throw new Error("Impossible de récupérer l'email associé à ce pseudo.");
					}
				} catch (error: any) {
					console.error("Erreur lors de la recherche du pseudo:", error);
					throw new Error("Erreur lors de la recherche du pseudo: " + error.message);
				}
			}

			if (!email) {
				throw new Error("L'email est requis");
			}

			console.log("Tentative de connexion avec:", { email, password: "********" });
			const userCredential = await login(email, password);

			const user = userCredential.user;

			// Vérifier si l'utilisateur est un admin
			const adminRef = doc(db, "admins", user.uid);
			const adminSnap = await getDoc(adminRef);

			if (adminSnap.exists()) {
				// Utilisateur est un admin
				await updateProfile(user, adminSnap.data().pseudo || user.displayName || "");
				router.push("/home");
			} else {
				// Utilisateur n'est pas un admin
				throw new Error("Accès refusé. Vous n'êtes pas un administrateur.");
			}
		} catch (error: any) {
			setError(
				"Impossible de vous connecter: " + error.message
			);
			console.error("Erreur de connexion:", error);
		}
		setLoading(false);
	};

	const handleThemeToggle = () => {
		document.body.classList.toggle("dark");
	};

	const [progress, setProgress] = React.useState(13)
 
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Progress value={progress} className="w-[100%] max-w-sm" />
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<div className="w-full max-w-sm">
				<div className="flex justify-center items-center space-x-4 mb-6 mt-[-2rem]">
					<Image
						src={"/mclu-logo.png"}
						className="w-40 h-auto"
						width={160}
						height={160}
						alt="Logo MCLU"
						loading="lazy"
					/>
					<Image
						src={"/logo-sigfu.png"}
						className="w-40 h-auto"
						width={160}
						height={160}
						alt="Logo SIGFU"
						loading="lazy"
					/>
				</div>
				<form onSubmit={handleSubmit}>
					<Card className='w-full'>
						<CardHeader>
							<CardTitle className='text-2xl'>Connexion</CardTitle>
							<CardDescription>
								Entrez votre email ci-dessous pour vous connecter à votre compte{" "}
								{error && <p className='text-red-600'>{error}</p>}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid gap-4'>
								<div className='flex justify-between'>
									<Button
										type="button"
										variant={loginMethod === 'email' ? 'default' : 'outline'}
										onClick={() => setLoginMethod('email')}
									>
										Email
									</Button>
									<Button
										type="button"
										variant={loginMethod === 'pseudo' ? 'default' : 'outline'}
										onClick={() => setLoginMethod('pseudo')}
									>
										Pseudo
									</Button>
								</div>
								{loginMethod === 'pseudo' ? (
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
								) : (
									<div className='grid gap-2'>
										<Label htmlFor='pseudo'>Pseudo</Label>
										<Input
											id='pseudo'
											type='text'
											ref={pseudoRef}
											placeholder='Votre pseudo'
											required
										/>
									</div>
								)}
								<div className='grid gap-2'>
									<div className='flex items-center'>
										<Label htmlFor='password'>Mot de passe</Label>
									</div>
									<KeySquare />
									<Input id='password' type='password' ref={passwordRef} required />
									
								</div>
								<Button type='submit' className='w-full'>
									{loading ? (
										<Button disabled>
											<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
											Patienter...
										</Button>
									) : (
										"Se Connexion"
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				</form>
			</div>
		</div>
	);
}