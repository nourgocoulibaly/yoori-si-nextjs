import { AuthProvider } from "@/contexts/AuthContext";
import AuthToggle from "./userAuth/_components/authToggle";

function page() {
	return (
		<AuthProvider>
			<AuthToggle />
		</AuthProvider>
	);
}

export default page;
