"use client";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebaseConfig"; // Assurez-vous que cette importation est correcte
import { ReloadIcon } from "@radix-ui/react-icons";
import { doc, getDoc } from "firebase/firestore";
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
import Link from "next/link";

export default function Login() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const { login } = useAuth();
	const router = useRouter();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			const userCredential = await login(
				emailRef.current?.value || "",
				passwordRef.current?.value || ""
			);

			// Vérifier si l'utilisateur est un admin
			const adminRef = doc(db, "admins", userCredential.user.uid);
			const adminSnap = await getDoc(adminRef);

			if (adminSnap.exists()) {
				router.push("/adminAuth"); // Page sécurisée pour les admins
				return;
			}

			// Vérifier si l'utilisateur est un user
			const userRef = doc(db, "users", userCredential.user.uid);
			const userSnap = await getDoc(userRef);

			if (userSnap.exists()) {
				router.push("/home/user"); // Page sécurisée pour les utilisateurs
				return;
			}

			throw new Error("Accès non autorisé");
		} catch (error) {
			setError(
				"🤖Impossible de vous connecter, vérifiez les informations saisie"
			);
		}
		setLoading(false);
	};

	return (
		<div className='flex justify-center items-center h-screen'>
			<form onSubmit={handleSubmit}>
				<Card className='mx-auto max-w-sm'>
					<CardHeader>
						<CardTitle className='text-2xl'>Connexion</CardTitle>
						<CardDescription>
							Entrez votre email ci-dessous pour vous connecter à votre compte{" "}
							{error && <p className='text-red-600 pt-2'>{error}</p>}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid gap-4'>
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
							<div className='grid gap-2'>
								<div className='flex items-center'>
									<Label htmlFor='password'>Mot de passe</Label>
									<Link
										href='#'
										className='ml-auto inline-block text-sm underline'
									>
										Mot de passe oublié?{" "}
									</Link>
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
									"Se Connexion"
								)}
							</Button>
							<Button variant='outline' className='w-full'>
								Se connecter avec Google{" "}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}