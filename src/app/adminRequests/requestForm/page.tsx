import AdminNavBar from "../../adminDashboard/_components/navbar"; // Change the import path
import RequestForm from "./_components/requestForm";


export default function UserDashboard() {
	return (
		<div className='flex min-h-screen w-full flex-col'>
			<AdminNavBar>
				<RequestForm />
			</AdminNavBar>
		</div>
	);
}
