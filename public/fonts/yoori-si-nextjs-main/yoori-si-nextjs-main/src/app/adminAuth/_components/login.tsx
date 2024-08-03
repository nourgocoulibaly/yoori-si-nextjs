"use client";

import React from "react";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebaseConfig"; // Assurez-vous que le chemin est correct
import { ReloadIcon } from "@radix-ui/react-icons";
import { doc, getDoc } from "firebase/firestore";
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
import Link from "next/link";
export default function Login() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const { login } = useAuth();
	const router = useRouter();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [darkMode, setDarkMode] = React.useState(true);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			setError("");
			setLoading(true);
			const userCredential = await login(
				emailRef.current?.value || "",
				passwordRef.current?.value || ""
			);
			const user = userCredential.user;

			// Vérifier si l'utilisateur est un admin
			const adminRef = doc(db, "admins", user.uid);
			const adminSnap = await getDoc(adminRef);

			if (adminSnap.exists()) {
				// Utilisateur est un admin
				router.push("/home");
			} else {
				// Utilisateur n'est pas un admin
				throw new Error("Accès refusé. Vous n'êtes pas un administrateur.");
			}
		} catch (error: any) {
			setError(
				"Impossible de vous connecter, vérifiez vos informations ou vos droits d'accès: " +
					error.message
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
		return <Progress value={progress} className="w-[100%]" />
	}

	return (
		<form onSubmit={handleSubmit}>
			<Button onClick={handleThemeToggle}>
				{document.body.classList.contains("dark")
					? "Mode Clair"
					: "Mode Sombre"}
			</Button>
			<Card
				className='mx-auto max-w-sm ${
				darkMode ? "bg-dark" : "bg-light"
			}'
			>
				<CardHeader>
					<CardTitle className='text-2xl'>Connexion</CardTitle>
					<CardDescription>
						Entrez votre email ci-dessous pour vous connecter à votre compte{" "}
						{error && <p className='text-red-600'>{error}</p>}
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
						<Button variant='outline' className='w-full'>
							Se connecter avec Google{" "}
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
