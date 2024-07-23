import AdminNavBar from "../../adminDashboard/_components/navbar"; // Change the import path
import RequestHistory from "./_components/history";


export default function UserDashboard() {
	return (
		<div className='flex min-h-screen w-full flex-col'>
			<AdminNavBar>
				<RequestHistory />
			</AdminNavBar>
		</div>
	);
}
