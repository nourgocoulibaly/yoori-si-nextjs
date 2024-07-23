import UserNavBar from "@/app/userDashboard/_components/navbar";
import Account from "./_components/accountDetail";


export default function UserDashboard() {
	return (
		<div className='flex min-h-screen w-full flex-col'>
			<UserNavBar>
				<Account />
			</UserNavBar>
		</div>
	);
}
