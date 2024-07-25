"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Login from "./login";
import Signup from "./signup";

export default function AuthToggle() {
	const [isSignup, setIsSignup] = useState(false);
	const router = useRouter();

	const toggleAuthMode = () => {
		setIsSignup(!isSignup);
		router.push(isSignup ? '/login' : '/signup');
	};

	return (
		<div className='mt-4 text-center text-sm'>
			{isSignup ? <Signup /> : <Login />}
			<button onClick={toggleAuthMode}>
				{isSignup
					? "Vous avez déjà un compte? Connectez-vous"
					: "Besoin d'un compte ? Inscrivez-vous"}
			</button>
		</div>
	);
}