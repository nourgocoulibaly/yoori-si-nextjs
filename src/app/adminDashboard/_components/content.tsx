"use client"

import Link from "next/link";

import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import {
	Activity,
	ArrowUpRight,
	BookmarkCheck,
	ClipboardX,
	Clock
} from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useEffect, useState } from "react";

import { useRouter } from 'next/navigation';


export default function AdminDashboardContent() {

  const [usersList, setUsersList] = useState<any[]>([]);
	const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
	const [filteredUsersList, setFilteredUsersList] = useState<any[]>([]);
	const [pendingRequests, setPendingRequests] = useState(0);
	const [resolvedRequests, setResolvedRequests] = useState(0);
	const [notResolvedRequests, setNotResolvedRequests] = useState(0);
	const [totalRequests, setTotalRequests] = useState(0); // Added this line
	const router = useRouter();



	useEffect(() => {
    const fetchUsersList = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersListData: any[] = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userName = userData.userName;
            usersListData.push({ id: doc.id, ...userData, userName });
        });
        setUsersList(usersListData);
        setFilteredUsersList(usersListData);
    };

    fetchUsersList(); // Call the fetchUsersList function
}, []);

	useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "userRequests"));
      const requestsData: any[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const userName = userData.userName;
        requestsData.push({ id: doc.id, ...userData, userName });
      });

      setRequests(requestsData);
      setFilteredRequests(requestsData); // Initialiser avec toutes les requêtes
    };

    fetchRequests();

  }, []);

	useEffect(() => {
		const pending = filteredRequests.filter(req => req.requestStatus === 'En attente').length;
		const resolved = filteredRequests.filter(req => req.requestStatus === 'Resolu').length;
		const notResolved = filteredRequests.filter(req => req.requestStatus === 'Non resolu').length;
		const total = filteredRequests.length;
		setPendingRequests(pending);
		setResolvedRequests(resolved);
		setNotResolvedRequests(notResolved);
		setTotalRequests(total); // Added this line
	}, [filteredRequests]);

	const handleEditRequest = (id: string) => {
    const requestToEdit = requests.find(request => request.id === id);


    console.log("Modifier la requête :", requestToEdit);
    console.log(requestToEdit);
    console.log("Chemin request/page.tsx");

    // Rediriger vers la page request/page.tsx avec l'id de la requête
    router.push(`/adminRequests/request/${id}`);
    // router.push(`/adminRequests/request/[id]`);
    // router.push(`/adminRequests/request`);
};



	return (
		<>
			<main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				<div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
					<Card x-chunk='dashboard-01-chunk-0'>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
							Total Requête
							</CardTitle>
							<Activity className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{filteredRequests.length}</div>
							<p className='text-xs text-muted-foreground'>
							{filteredRequests.length > 0 ? `+${Math.round((filteredRequests.length / requests.length) * 100)}% par rapport à la semaine dernière` : ''}
							</p>
						</CardContent>
					</Card>
					
					<Card x-chunk='dashboard-01-chunk-2'>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>Requêtes en attente</CardTitle>
							<Clock className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{pendingRequests}</div>
							<p className='text-xs text-muted-foreground'>
								{pendingRequests > 0 ? `${Math.round((pendingRequests / filteredRequests.length) * 100)}% du total des requêtes` : 'Aucune requête en attente'}
							</p>
						</CardContent>
					</Card>
					<Card x-chunk='dashboard-01-chunk-3'>
  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
    <CardTitle className='text-sm font-medium'>Requêtes résolues</CardTitle>
    <BookmarkCheck className='h-4 w-4 text-muted-foreground' />
  </CardHeader>
  <CardContent>
    <div className='text-2xl font-bold'>{resolvedRequests}</div>
    <p className='text-xs text-muted-foreground'>
		{resolvedRequests > 0 ? `${Math.round((resolvedRequests / filteredRequests.length) * 100)}% du total des requêtes` : 'Aucune requête Resolue'}
    </p>
  </CardContent>
</Card>

<Card x-chunk='dashboard-01-chunk-1'>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
							Requêtes non résolues
							</CardTitle>
							<ClipboardX className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{notResolvedRequests}</div>
							<p className='text-xs text-muted-foreground'>
							{notResolvedRequests > 0 ? `${Math.round((notResolvedRequests / filteredRequests.length) * 100)}% du total des requêtes` : 'Aucune requête Resolue'}
							</p>
						</CardContent>
					</Card>
				</div>
				<div className='grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
					<Card className='xl:col-span-2' x-chunk='dashboard-01-chunk-4'>
						<CardHeader className='flex flex-row items-center'>
							<div className='grid gap-2'>
								<CardTitle>Requêtes Récentes</CardTitle>
								<CardDescription>
								Les 5 requêtes les plus récentes sont répertoriées ici..
								</CardDescription>
							</div>
							<Button asChild size='sm' className='ml-auto gap-1'>
								<Link href='/adminRequests'>
									Voir Plus
									<ArrowUpRight className='h-4 w-4' />
								</Link>
							</Button>
						</CardHeader>
						<CardContent>
									<Table>
									{/* <div onClick={() => handleEditRequest(requests.id)} style={{ cursor: 'pointer' }}> */}
										<TableHeader>
											<TableRow>
												<TableHead>Utilisateur</TableHead>
												<TableHead className='hidden sm:table-cell'>
												Nature de l&apos;Intervention
												</TableHead>
												<TableHead className='hidden sm:table-cell'>
													Statut
												</TableHead>
												<TableHead className='hidden md:table-cell'>
													Date
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
				
    		{filteredRequests
              .sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                return dateB - dateA;
              })
              .slice(0, 5)
              .map((request) => (
                <TableRow key={request.id} onClick={() => handleEditRequest(request.id)} 
                style={{ cursor: 'pointer' }}>
						
										<TableCell className='hidden sm:table-cell'>
											<div className='font-medium'>{request.userName}</div>
											<div className='hidden text-sm text-muted-foreground md:inline'>{request.userDirection}</div>
										</TableCell>
										<TableCell className='hidden sm:table-cell'>
											{request.requestContent}
										</TableCell>
										<TableCell className='hidden sm:table-cell'>
											<Badge className='text-xs' variant='secondary'>
												{request.requestStatus}
											</Badge>
										</TableCell>
										<TableCell className='hidden sm:table-cell'>
											{request.createdAt?.toDate()?.toLocaleString() || ''}
										</TableCell>
						
						</TableRow>
    		))}
				</TableBody>
        {/* // <TableRow key={request.id}>
        //     <TableCell className='hidden sm:table-cell'>
        //         <div className='font-medium'>{request.userName}</div>
        //         <div className='hidden text-sm text-muted-foreground md:inline'>{request.userDirection}</div>
        //     </TableCell>
        //     <TableCell className='hidden sm:table-cell'>
        //         {request.requestContent}
        //     </TableCell>
        //     <TableCell className='hidden sm:table-cell'>
        //         <Badge className='text-xs' variant='secondary'>
        //             {request.requestStatus}
        //         </Badge>
        //     </TableCell>
        //     <TableCell className='hidden sm:table-cell'>
        //         {request.createdAt?.toDate()?.toLocaleString() || ''}
        //     </TableCell>
        // </TableRow> */}

{/* </div> */}
									</Table>
								</CardContent>
					</Card>
					<Card x-chunk='dashboard-01-chunk-5'>
    <CardHeader>
        <CardTitle>Nombre de Requête par Utilisateur</CardTitle>
    </CardHeader>
    <CardContent className='grid gap-5'>
        {filteredRequests
            .sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                return dateB - dateA;
            })
            .slice(0, 5)
            .reduce((acc: { userName: string; count: number; }[], request) => {
							const existingUser = acc.find(user => user.userName === request.userName);
							if (existingUser) {
									existingUser.count++;
							} else {
									acc.push({ userName: request.userName, count: 1 });
							}
							return acc;
					}, [])
            .map((user : any) => (
                <div className='flex items-center gap-4' key={user.id}>
                    <Avatar className='hidden h-9 w-9 sm:flex'>
                        <AvatarImage src={`/avatars/${user.id}.png`} alt='Avatar' />
                        <AvatarFallback>{user.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className='grid gap-1'>
                        <p className='text-sm font-medium leading-none'>
                            {user.userName}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            {user.direction}
                        </p>
                    </div>
                    <div className='ml-auto font-medium'>{user.count}</div>
                </div>
            ))}
    </CardContent>
</Card>
				</div>
			</main>
		</>
	);
}