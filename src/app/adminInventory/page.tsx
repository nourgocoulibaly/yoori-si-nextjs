import AdminNavbar from "../adminDashboard/_components/navbar";
import { AdminInventory } from "./_components/adminInventory";

function page() {
	return (
		<div>
			<AdminNavbar>
				<AdminInventory />
			</AdminNavbar>
		</div>
	);
}

export default page;
