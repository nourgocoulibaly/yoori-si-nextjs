import AdminDashboardContent from "./_components/content";
import AdminNavBar from "./_components/navbar";


export default function UserDashboard() {
	return (
		<div className='flex min-h-screen w-full flex-col'>
			<AdminNavBar>
				<AdminDashboardContent />
			</AdminNavBar>
		</div>
	);
}
