import AdminNavbar from "@/app/adminDashboard/_components/navbar";
import AdminRequests from "./_components/adminRequestsBeta";

function page() {
	return (
		<div>
			<AdminNavbar>
				<AdminRequests />
			</AdminNavbar>
		</div>
	);
}

export default page;
