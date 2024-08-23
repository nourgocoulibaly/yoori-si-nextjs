"use client";

import { User, updateProfile } from "firebase/auth"; // Importez updateProfile depuis firebase/auth
import { useRouter } from "next/navigation";
import { useState } from "react";
import Login from "./login";
import Signup from "./signup";

export default function AuthToggle() {
	const [isSignup, setIsSignup] = useState(false);
	const router = useRouter();

	const toggleAuthMode = () => {
		setIsSignup(!isSignup);
	};

	const handleNavigation = (path: string) => {
		router.push(path); // Utilisation de router.push pour la navigation dynamique
	};

	// Ajoutez cette fonction pour gérer la mise à jour du profil
	const handleUpdateProfile = async (user: User, displayName: string) => {
		try {
			await updateProfile(user, { displayName });
		} catch (error) {
			console.error("Erreur lors de la mise à jour du profil :", error);
		}
	};

	return (
		<div className='mt-4 text-center text-sm'>
			{isSignup ? <Signup updateProfile={handleUpdateProfile} /> : <Login updateProfile={handleUpdateProfile} />}
			<button onClick={toggleAuthMode}>
				{isSignup
					? "Vous avez déjà un compte? Connectez-vous"
					: "Besoin d'un compte ? Inscrivez-vous"}
			</button>
		</div>
	);
}