"use client";

import { useState } from "react";
import Login from "./login";
import Signup from "./signup";

// interface AuthToggleProps {
// 	children?: React.ReactNode;
// }

// export default function AuthToggle({ children }: AuthToggleProps) {
export default function AuthToggle() {
	const [isSignup, setIsSignup] = useState(false);

	const toggleAuthMode = () => {
		setIsSignup(!isSignup);
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
		</div>
	);
}
