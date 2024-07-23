"use client";

import { useState } from "react";
import Login from "./login";
import Signup from "./signup";

export default function AuthToggle() {
	const [isSignup, setIsSignup] = useState(false);

	const toggleAuthMode = () => {
		setIsSignup(!isSignup);
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
