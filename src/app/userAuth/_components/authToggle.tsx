"use client";

import { User, updateProfile } from "firebase/auth"; // Importez updateProfile depuis firebase/auth
import { useRouter } from "next/navigation"; // Importation de useRouter
import { useState } from "react";
import Login from "./login";
import Signup from "./signup";

// interface AuthToggleProps {
// 	children?: React.ReactNode;
// }

// export default function AuthToggle({ children }: AuthToggleProps) {
export default function AuthToggle() {
	const [isSignup, setIsSignup] = useState(false);
	const router = useRouter(); // Initialisation de useRouter

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
			 {/* {children} */}
			<button onClick={toggleAuthMode} className='text-center'>
				{isSignup
					? "Vous avez déjà un compte? Connectez-vous"
					: "Besoin d'un compte ? Inscrivez-vous"}
			</button>
		</div>
	);
}