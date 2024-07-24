"use client"

import { db } from "@/lib/firebaseConfig";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Progress } from "@/components/ui/progress";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
	File, History, ListFilter
} from 'lucide-react';

import { useRouter } from 'next/navigation';



const AdminRequestsBeta = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
	const router = useRouter();
	const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "userRequests"));
        const requestsData: any[] = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userName = userData.userName;
          const createdAt = userData.createdAt && typeof userData.createdAt.toDate === 'function' ? userData.createdAt.toDate() : null;
          const updatedAt = userData.updatedAt && typeof userData.updatedAt.toDate === 'function' ? userData.updatedAt.toDate() : null;
          requestsData.push({ id: doc.id, ...userData, userName, createdAt, updatedAt });
        });

        requestsData.sort((a, b) => {
          const dateA = a.createdAt || a.updatedAt;
          const dateB = b.createdAt || b.updatedAt;
          if (dateA && dateB) {
            return dateB.getTime() - dateA.getTime();
          }
          return 0;
        });

        setRequests(requestsData);
        setFilteredRequests(requestsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des requêtes :", error);
      }
    };

    fetchRequests();
  }, []);

  const handleMarkAs = async (id: string, status: string) => {
    try {
      const requestDoc = doc(db, "userRequests", id);
      await updateDoc(requestDoc, { status });
      setRequests(requests.map(request => request.id === id ? { ...request, status } : request));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la requête :", error);
    }
  };

  const handleEditRequest = (id: string) => {
    const requestToEdit = requests.find(request => request.id === id);
    console.log("Modifier la requête :", requestToEdit);
    router.push(`/adminRequests/request/${id}`);
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      const requestDoc = doc(db, "userRequests", id);
      await deleteDoc(requestDoc);
    } catch (error) {
      console.error("Erreur lors de la suppression de la requête :", error);
    }
  };

  const filterRequestsByTime = (time: string) => {
    let filteredRequests = [];

    if (time === 'week') {
        filteredRequests = requests.filter(request => {
            const requestDate = request.createdAt;
            const currentDate = new Date();
            const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
            return requestDate && requestDate.getTime() >= oneWeekAgo.getTime() && requestDate.getTime() <= currentDate.getTime();
        });
        console.log('🤖Filtre Semaine');
    } else if (time === 'month') {
			filteredRequests = requests.filter(request => {
				const requestDate = request.createdAt;
            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            return requestDate && requestDate.getTime() >= firstDayOfMonth.getTime() && requestDate.getTime() <= lastDayOfMonth.getTime();
        });
        console.log('🤖Filtre Mois');
    } else if (time === 'year') {
        filteredRequests = requests.filter(request => {
            const requestDate = request.createdAt || request.updatedAt;
            const currentDate = new Date();
            const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
            const lastDayOfYear = new Date(currentDate.getFullYear(), 11, 31);
            return requestDate && requestDate.getTime() >= firstDayOfYear.getTime() && requestDate.getTime() <= lastDayOfYear.getTime();
        });
        console.log('🤖Filtre Annee');
    } else if (time === 'all') {
			filteredRequests = requests;
			console.log('🤖Filtre Tout');
		}

    filteredRequests.sort((a, b) => {
      const dateA = a.createdAt || a.updatedAt;
      const dateB = b.createdAt || b.updatedAt;

      if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime();
      }

      return 0;
    });

    setFilteredRequests(filteredRequests);
};

  const filterRequestsByTimeRef = useRef(filterRequestsByTime);

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40 '>
			<main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 mt-10'>
				<div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
					<div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
						<Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-0'>
							<CardHeader className='pb-3'>
								<CardTitle>Nouvelle Intervention</CardTitle>
								<CardDescription className='max-w-lg text-balance leading-relaxed'>
									Présentation de notre tableau de bord de commandes dynamiques
									pour une gestion transparente et une analyse approfondie.
								</CardDescription>
							</CardHeader>
							<CardFooter>
							<a href='/adminRequests/requestForm'>
    <Button>Créer une nouvelle commande</Button>
</a>
							</CardFooter>
						</Card>
						<Card x-chunk='dashboard-05-chunk-1'>
							<CardHeader className='pb-2'>
								<CardDescription>Nombre de Requêtes</CardDescription>
								<CardTitle className='text-4xl'>{filteredRequests.length}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-xs text-muted-foreground'>
									{filteredRequests.length > 0 ? `+${Math.round((filteredRequests.length / requests.length) * 100)}% par rapport à la semaine dernière` : ''}
								</div>
							</CardContent>
							<CardFooter>
								<Progress value={(filteredRequests.length / requests.length) * 100} aria-label='25% increase' />
							</CardFooter>
						</Card>
						<Card x-chunk='dashboard-05-chunk-2'>
  <CardHeader className='pb-2'>
    <CardDescription>Requêtes En attente</CardDescription>
    <CardTitle className='text-4xl'>
      {filteredRequests.filter(request => request.requestStatus === "En attente").length}
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className='text-xs text-muted-foreground'>
      {filteredRequests.length > 0 ? 
        `${Math.round((filteredRequests.filter(request => request.requestStatus === "En attente").length / filteredRequests.length) * 100)}% du total des requêtes` :
        'Aucune requête en attente'
      }
    </div>
  </CardContent>
  <CardFooter>
    <Progress 
      value={filteredRequests.length > 0 ? 
        (filteredRequests.filter(request => request.requestStatus === "En attente").length / filteredRequests.length) * 100 :
        0
      } 
      aria-label='Pourcentage de requêtes en attente' 
    />
  </CardFooter>
</Card>

					</div>
					<Tabs defaultValue="all">
						<div className='flex items-center'>
						<TabsList>
  <TabsTrigger value='all' onClick={() => { setActiveTab('all'); filterRequestsByTime('all'); }}>Tout</TabsTrigger>
  <TabsTrigger value='week' onClick={() => { setActiveTab('week'); filterRequestsByTime('week'); }}>Semaine</TabsTrigger>
  <TabsTrigger value='month' onClick={() => { setActiveTab('month'); filterRequestsByTime('month'); }}>Mois</TabsTrigger>
  <TabsTrigger value='year' onClick={() => { setActiveTab('year'); filterRequestsByTime('year'); }}>Annee</TabsTrigger>
</TabsList>
							<div className='ml-auto flex items-center gap-2'>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='outline'
											size='sm'
											className='h-7 gap-1 text-sm'
										>
											<ListFilter className='h-3.5 w-3.5' />
											<span className='sr-only sm:not-sr-only'>Filtre</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem checked>
											Resolu
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>En Attente</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>
											Non Resolu
										</DropdownMenuCheckboxItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<a href='/adminRequests/history'>
										<Button
											variant='outline'
											size='sm'
											className='h-7 gap-1 text-sm'
										>
											<History className='h-3.5 w-3.5' />
											<span className='sr-only sm:not-sr-only'>Historique</span>
										</Button>
										</a>
										</DropdownMenuTrigger>
								</DropdownMenu>
    {/* <DropdownMenuTrigger asChild>
		<DropdownMenuContent>
      <a href='/adminInventory/history' className='h-7 gap-1 text-sm'>
        Historique
      </a>
    </DropdownMenuTrigger>
		</DropdownMenuContent>
  </DropdownMenu> */} 
								<Button
									size='sm'
									variant='outline'
									className='h-7 gap-1 text-sm'
								>
									<File className='h-3.5 w-3.5' />
									<span className='sr-only sm:not-sr-only'>Exporter</span>
								</Button>
							</div>
						</div>

            {/* Tabs value Week */}
						<TabsContent value="all">
							<Card x-chunk='dashboard-05-chunk-3'>
								<CardHeader className='px-7'>
									<CardTitle>Interventions</CardTitle>
									<CardDescription>
										Liste des demandes des Interventions
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
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
											{filteredRequests.map((request) => (
												<TableRow key={request.id} onClick={() => handleEditRequest(request.id)} 
												style={{ cursor: 'pointer' }}>
												{/* <TableRow key={request.id}> */}
													{/* <TableCell className='hidden sm:table-cell'>
													<Avatar className='hidden h-9 w-9 sm:flex'>
                    <AvatarImage src={`/avatars/${request.id}.png`} alt='Avatar' />
                    <AvatarFallback>{request.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                          </TableCell> */}
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
                          {request.createdAt?.toLocaleString() || ''}
                            {/* {request.createdAt ? request.createdAt.dates : ''} */}
                          </TableCell>
													{/* <TableCell>
													<Button onClick={() => handleEditRequest(request.id)}><Settings /></Button>													
													</TableCell> */}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="week">
							<Card x-chunk='dashboard-05-chunk-3'>
								<CardHeader className='px-7'>
									<CardTitle>Interventions</CardTitle>
									<CardDescription>
										Liste des demandes des Interventions
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
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
											{filteredRequests.map((request) => (
												<TableRow key={request.id} onClick={() => handleEditRequest(request.id)} 
												style={{ cursor: 'pointer' }}>
												{/* <TableRow key={request.id}> */}
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
                          {request.createdAt?.toLocaleString() || ''}
                            {/* {request.createdAt ? request.createdAt.dates : ''} */}
                          </TableCell>
													{/* <TableCell>
													<Button onClick={() => handleEditRequest(request.id)}><Settings /></Button>													
													</TableCell> */}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

            {/* Tabs value Month */}
						<TabsContent value="month">
							<Card x-chunk='dashboard-05-chunk-3'>
								<CardHeader className='px-7'>
									<CardTitle>Interventions</CardTitle>
									<CardDescription>
										Liste des demandes des Interventions
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
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
										{filteredRequests.map((request) => (
											<TableRow key={request.id} onClick={() => handleEditRequest(request.id)} 
											style={{ cursor: 'pointer' }}>
            {/* <TableRow key={request.id}> */}
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
                          {request.createdAt?.toLocaleString() || ''}
                            {/* {request.createdAt ? request.createdAt.dates : ''} */}
                          </TableCell>
													{/* <TableCell>
													<Button onClick={() => handleEditRequest(request.id)}><Settings /></Button>													
													</TableCell> */}
            </TableRow>
          ))}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</TabsContent>

            {/* Tabs value Year */}
						<TabsContent value="year">
  <Card x-chunk='dashboard-05-chunk-3'>
    <CardHeader className='px-7'>
      <CardTitle>Interventions</CardTitle>
      <CardDescription>
        Liste des demandes des Interventions
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
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
          {filteredRequests.map((request) => (
						<TableRow key={request.id} onClick={() => handleEditRequest(request.id)} 
						style={{ cursor: 'pointer' }}>
            {/* <TableRow key={request.id}> */}
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
                {request.createdAt?.toLocaleString() || ''}
              </TableCell>
							{/* <TableCell>
													<Button onClick={() => handleEditRequest(request.id)}><Settings /></Button>													
							</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</TabsContent>
					</Tabs>
				</div>

        {/* Section Droite */}
				<div>
					<Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
						<CardHeader className='flex flex-row items-start bg-muted/50'>
							<div className='grid gap-0.5'>
								<CardTitle className='group flex items-center gap-2 text-lg'>
									Nombre de Requête par Utilisateur
								</CardTitle>						
							</div>
							<div className='ml-auto flex items-center gap-1'>
							</div>
						</CardHeader>
						
						<CardContent className='p-6 text-sm grid gap-3'>
						{filteredRequests.reduce((uniqueUsers, request) => {
            if (!uniqueUsers.some((user : any ) => user.userName === request.userName)) {
                uniqueUsers.push(request);
            }
            return uniqueUsers;
        }, []).map((request : any) => (
            <div className='flex items-center gap-4' key={request.id}>
                <Avatar className='hidden h-9 w-9 sm:flex'>
                    <AvatarImage src={`/avatars/${request.id}.png`} alt='Avatar' />
                    <AvatarFallback>{request.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='grid gap-1'>
                    <p className='text-sm font-medium leading-none'>
                        {request.userName}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        {request.userDirection}
                    </p>
                </div>
                <div className='ml-auto font-medium'>{filteredRequests.filter(req => req.userName === request.userName).length}</div>
            </div>
        ))}
						</CardContent>
					</Card>
				</div>
			</main>
    </div>
  );
};

export default AdminRequestsBeta;










