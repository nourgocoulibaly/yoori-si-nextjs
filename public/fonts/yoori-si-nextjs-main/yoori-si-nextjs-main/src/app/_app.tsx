import { AuthProvider } from '@/contexts/AuthContext';
import { AppProps } from 'next/app';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.body.classList.add("dark"); // Ajouter la classe "dark" par défaut
		}
	}, []);

	return (
		<AuthProvider>
			<Component {...pageProps} />
		</AuthProvider>
	);
}

export default MyApp;