"use client";

import Image from "next/image";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebaseConfig"; // Assurez-vous que cette importation est correcte
import { ReloadIcon } from "@radix-ui/react-icons";
import { User } from "firebase/auth"; // Importez updateProfile depuis firebase/auth
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
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

interface LoginProps {
  updateProfile: (user: User, displayName: string) => Promise<void>;
}

export default function Login({ updateProfile }: LoginProps) {
	const pseudoRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const { login, setUserRole } = useAuth();
	const router = useRouter();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
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

			let email: string;

			if (loginMethod === 'email') {
				email = emailRef.current?.value || "";
			} else {
				// Recherche de l'email associé au pseudo
				const userQuery = query(collection(db, "users"), where("pseudo", "==", pseudoRef.current?.value));
				const userSnapshot = await getDocs(userQuery);

				if (userSnapshot.empty) {
					throw new Error("Aucun utilisateur trouvé avec ce pseudo.");
				}

				const userData = userSnapshot.docs[0].data();
				email = userData.email;

				// Ajout de vérification des permissions
				if (!userData.email) {
					throw new Error("Impossible de récupérer l'email associé à ce pseudo.");
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
				await setUserRole('admin');
				router.push("/adminDashboard");
				return;
			}

			// Vérifier si l'utilisateur est un user normal
			const userRef = doc(db, "users", user.uid);
			const userSnap = await getDoc(userRef);

			if (userSnap.exists()) {
				// Utilisateur est un user normal
				await updateProfile(user, userSnap.data().pseudo || user.displayName || "");
				await setUserRole('user');
				router.push("/userDashboard");
				return;
			}

			// Si l'utilisateur n'est ni admin ni user normal
			throw new Error("Accès non autorisé. Compte non reconnu.");
		} catch (error: any) {
			setError(
				"Impossible de vous connecter, vérifiez vos informations: " + error.message
			);
			console.error("Erreur de connexion:", error);
		}
		setLoading(false);
	};

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
								Connectez-vous à votre compte
								{error && <p className='text-red-600 pt-2'>{error}</p>}
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
								{loginMethod === 'email' ? (
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
									<Input
										id='password'
										type='password'
										ref={passwordRef}
										required
									/>
								</div>
								<Button type='submit' className='w-full'>
									{loading ? (
										<Button disabled>
											<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
											Patienter...
										</Button>
									) : (
										"Se Connecter"
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