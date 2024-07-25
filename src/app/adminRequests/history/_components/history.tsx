"use client"
// Composant externe pour afficher l'historique de toutes les requêtes


import {
  ChevronLeft
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { collection, getDocs } from "firebase/firestore";

import { useEffect, useState } from "react";

import Link from "next/link"; // Importer Link pour remplacer les balises a href
import { useRouter } from "next/navigation";


import { db } from "@/lib/firebaseConfig"; // Importer la référence à la base de données Firestore

const RequestHistory = () => {
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [isTouched, setIsTouched] = useState(false); // Nouvel état pour vérifier si la collection est touchée
  const router = useRouter();


  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "userRequests"));
      const requestsData: any[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const userName = userData.userName;
        requestsData.push({ id: doc.id, ...userData, userName });
      });

			  // Tri des requêtes par ordre décroissant de date
				requestsData.sort((a, b) => {
					const dateA = a.createdAt?.toDate() || a.updatedAt?.toDate();
					const dateB = b.createdAt?.toDate() || b.updatedAt?.toDate();
					if (dateA && dateB) {
						return dateB.getTime() - dateA.getTime();
					}
					return 0;
				});

      setAllRequests(requestsData);
      setFilteredRequests(requestsData); // Initialiser avec toutes les requêtes
      setIsTouched(requestsData.length > 0); // Vérifier si la collection est touchée
    };

    fetchRequests();

  }, []);

  const handleEditRequest = (id: string) => {
    console.log("ID de la requête à éditer :", id);
    router.push(`/adminRequests/request/${id}`);
  };

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40'>
      <div className='flex items-start gap-4 w-full flex-col bg-muted/40 max-w-[59rem] mx-24 mt-4 '>
        <Link href="/adminRequests/">
								<a className='inline-flex items-center gap-2'>
									<Button variant='outline' size='icon' className='h-7 w-7'>
										<ChevronLeft className='h-4 w-4' />
										<span className='sr-only'>Retour</span>
									</Button>
								</a>
			  </Link>
      </div>
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 mt-10'>
      <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
        <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
          <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-0'>
            <CardHeader className='pb-3'>
              <CardTitle>Interventions</CardTitle>
              <CardDescription className='max-w-lg text-balance leading-relaxed'>
                Présentation de notre tableau de bord de commandes dynamiques
                pour une gestion transparente et une analyse approfondie.
              </CardDescription>
            </CardHeader>
            <CardFooter>
            <Link href='/adminRequests/requestForm'>
            <a className='inline-flex items-center gap-2'>
            <Button>Créer une nouvelle commande</Button>
          </a>
            </Link>
            </CardFooter>
          </Card>
          <Card x-chunk='dashboard-05-chunk-1'>
            <CardHeader className='pb-2'>
              <CardDescription>Total des Interventions</CardDescription>
              <CardTitle className='text-4xl'>{allRequests.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-xs text-muted-foreground'>
                {allRequests.length > 0 ? `+${Math.round((allRequests.length / allRequests.length) * 100)}% par rapport à la semaine dernière` : ''}
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={(allRequests.length / allRequests.length) * 100} aria-label='25% increase' />
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue= "year">
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
      {allRequests.map((request) => (
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

export default RequestHistory;
