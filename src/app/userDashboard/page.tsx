import UserDashboardContent from "./_components/content";
import UserNavBar from "./_components/navbar";

export default function UserDashboard() {
	return (
		<div className='flex min-h-screen w-full flex-col'>
			<UserNavBar>
				<UserDashboardContent />
			</UserNavBar>
		</div>
	);
}
