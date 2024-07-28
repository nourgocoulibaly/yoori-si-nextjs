import { AuthProvider } from "@/contexts/AuthContext";
import AuthToggle from "./_components/authToggle";

export default function AuthPage() {
	return (
		<AuthProvider>
			<div>
				<AuthToggle />
			</div>
		</AuthProvider>
	);
}
