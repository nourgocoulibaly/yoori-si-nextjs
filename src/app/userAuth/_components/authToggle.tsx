"use client";

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

	return (
		<div className='mt-4 text-center text-sm'>
			{isSignup ? <Signup /> : <Login />}
			 {/* {children} */}
			<button onClick={toggleAuthMode} className='text-center'>
				{isSignup
					? "Vous avez déjà un compte? Connectez-vous"
					: "Besoin d'un compte ? Inscrivez-vous"}
			</button>
			<button onClick={() => handleNavigation('/some-path')} className='text-center'>
				Aller à une autre page
			</button>
		</div>
	);
}