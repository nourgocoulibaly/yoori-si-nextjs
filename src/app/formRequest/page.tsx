import UserNavBar from "@/app/userDashboard/_components/navbar";
import { AuthProvider } from "@/contexts/AuthContext"; // Assurez-vous que le chemin d'importation est correct
import UserFormBeta from "./_components/userFormBeta";

function page() {
	return (
		<AuthProvider>
			<UserNavBar>
				<UserFormBeta />
			</UserNavBar>
		</AuthProvider>
	);
}

export default page;
