"use client"

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { LegacyRef } from 'react';

import { db } from "@/lib/firebaseConfig";
import { Timestamp, addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { useRef } from "react";

import { ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/components/ui/use-toast";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";


interface User {
  uid: string;
  firstName: string;
  lastName: string;
  direction: string;
}

const RequestForm = () => {
    const router = useRouter();
		const { toast } = useToast()

		const requestUserFullNameRef = useRef<HTMLInputElement>(null);
		const requestUserDirectionRef =useRef<HTMLInputElement>(null);
    const requestContentRef = useRef<HTMLTextAreaElement>(null);
    const requestDomainRef = useRef<HTMLButtonElement>(null);
    const requestStatusRef = useRef<HTMLButtonElement>(null);

  const { currentUser } = useAuth() as { currentUser: User | null };

	const fullName = currentUser
		? `${currentUser.firstName} ${currentUser.lastName}`
		: "";

	const direction = currentUser ? currentUser.direction : "";


    const handleSubmit = async (e: React.FormEvent) => {

      e.preventDefault();

			const userName = requestUserFullNameRef.current?.value;
			const userDirection = requestUserDirectionRef.current?.value;
      const requestContent = requestContentRef.current?.value;
      const requestDomain = requestDomainRef.current?.textContent;
      const requestStatus = requestStatusRef.current?.textContent || "En attente";

      console.log("🟢", userName, ",", userDirection, ",", requestContent, ",", requestDomain, ",", requestStatus);

      if (!requestContent || !requestDomain) {
        alert("⛔Veuillez remplir tous les champs obligatoires");
        return;
      }

      try {
        const createdAt = Timestamp.now();

        await addDoc (collection(db, "userRequests"), {
          userName,
					userDirection,
          requestContent,
          requestDomain,
          requestStatus,
					createdAt: serverTimestamp(),
        })
        // alert ("✅ Demande envoyée avec succès !");

				requestUserFullNameRef.current!.value = "";
				requestUserDirectionRef.current!.value = "";
        requestContentRef.current!.value = "";
				requestDomainRef.current!.textContent = "";
				requestStatusRef.current!.textContent = "";

        console.log("✅ Données envoyées avec succès !");

      } catch (error) {
        console.log("⛔Impossible d'ajouter au document", error);
        // alert("⛔Erreur d'Enregistrement, Reessayer plus tard!");
					return (
						<AlertDialog>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>⛔Erreur d&apos;Enregistrement, Reessayer plus tard!</AlertDialogTitle>
									<AlertDialogDescription>
									Cette action n&apos;a pas été effectuée. Veuillez reessayer plus tard!
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogAction>OK</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)
      }
    };

  return (

<div className='bg-muted/40'>

    <form onSubmit={handleSubmit}>
			<div className='flex min-h-screen w-full flex-col bg-muted/40'>
				<div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
					<main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
						<div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'>
                    <div className='flex items-center gap-4'>
                        <Link href="/adminRequests/">
                          <Button variant='outline' size='icon' className='h-7 w-7'>
                            <ChevronLeft className='h-4 w-4' />
                            <span className='sr-only'>Retour</span>
                          </Button>
                        </Link>
                    </div>
						<div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'>
							<div className='flex items-center gap-4'>
								<h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
									Demande d&apos;Intervention
								</h1>
								<Badge variant='outline' className='ml-auto sm:ml-0'>
									DMISSA
								</Badge>
							</div>
							<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
								<div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
									<Card x-chunk='dashboard-07-chunk-0'>
										<CardHeader>
											<CardTitle>Details Demandeur</CardTitle>
											<CardDescription>
												Lipsum dolor sit amet, consectetur adipiscing elit
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div className='grid gap-6'>
												<div className='grid gap-3'>
													<Label htmlFor='name'>Nom & Prenoms</Label>
													<Input
														id='name'
														type='text'
														className='w-full'
														ref={requestUserFullNameRef}
														placeholder="Entrer le nom du Demandeur"
													/>
												</div>
												<div className='grid gap-3'>
													<Label htmlFor='name'>Direction/Service</Label>
													<Input
														id='direction'
														type='text'
														className='w-full'
														ref={requestUserDirectionRef}
														placeholder="Entrer sa Direction"
													/>
												</div>
												<div className='grid gap-3'>
													<Label htmlFor='content'>
														Nature de l&apos;Intervention
													</Label>
													<Textarea
														id='requestRef'
														ref={requestContentRef}
														placeholder="Entrer la nature de l'intervention"
														className='min-h-32'
													/>
												</div>
											</div>
										</CardContent>
									</Card>
									<Card x-chunk='dashboard-07-chunk-2'>
										<CardHeader>
											<CardTitle>Domaine d&apos;Intervention</CardTitle>
										</CardHeader>
										<CardContent>
											<div className='grid gap-6 sm:grid-cols-3'>
												<div className='grid gap-3'>
													<Label htmlFor='domain'>Materiels</Label>
													
														<Select>
															<SelectTrigger
																id='domain'
																ref={requestDomainRef as LegacyRef<HTMLButtonElement>}                                name='domain'
																aria-label='Selectionner'
															>
																<SelectValue placeholder="Selectionner" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value='computer'>PC</SelectItem>
																<SelectItem value='imprimante'>
																	Imprimante
																</SelectItem>
																<SelectItem value='telephonyIp'>
																	Telephonie IP
																</SelectItem>
																<SelectItem value='scanner'>Scanner</SelectItem>
																<SelectItem value='vdi'>VDI</SelectItem>
																<SelectItem value='others'>Autres</SelectItem>
															</SelectContent>
														</Select>
													</div>
												<div className='grid gap-3'>
													<Label htmlFor='domain'>
														Logiciels & Applications
													</Label>
													<Select>
														<SelectTrigger
															id='domain'
                              name='domain'
															ref={requestDomainRef as LegacyRef<HTMLButtonElement>}
															aria-label='Selectionner'
														>
															<SelectValue placeholder="selectionner"/>
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='sif'>
																SIF
															</SelectItem>
															<SelectItem value='office'>
																Microsoft Office
															</SelectItem>
															<SelectItem value='antivirus'>
																Antivirus
															</SelectItem>
															<SelectItem value='os'>
																Systeme d&apos;Exploitation
															</SelectItem>
															<SelectItem value='messagerie'>
																Messagerie Egouv
															</SelectItem>
															<SelectItem value='others'>Autres</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<div className='grid gap-3'>
													<Label htmlFor='domain'>Reseau</Label>
													<Select>
														<SelectTrigger
															id='domain'
                              name='domain'
															ref={requestDomainRef as LegacyRef<HTMLButtonElement>}
															aria-label='Selectionner'
                            
														>
															<SelectValue placeholder="Selectionner" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='office'>Cablage</SelectItem>
															<SelectItem value='antivirus'>
																Borne Wifi
															</SelectItem>
															<SelectItem value='os'>Switch</SelectItem>
															<SelectItem value='messagerie'>
																Reseau Sndi
															</SelectItem>
															<SelectItem value='others'>Box Orange</SelectItem>
														</SelectContent>
													</Select>
												</div>
												</div>
										</CardContent>
									</Card>
								</div>
								<div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
									<Card x-chunk='dashboard-07-chunk-3'>
										<CardHeader>
											<CardTitle>Statut de l&apos;Intervention</CardTitle>
										</CardHeader>
										<CardContent>
											<div className='grid gap-6'>
												<div className='grid gap-3'>
													<Label htmlFor='status'>Status</Label>
													<Select>
														<SelectTrigger
															id='status'
                              name='status'
															aria-label='Selectionner'
                              ref={requestStatusRef as LegacyRef<HTMLButtonElement>}
														>
															<SelectValue placeholder='En attente' />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='en_attente'>En attente</SelectItem>
															<SelectItem value='resolu'>
																Résolu
															</SelectItem>
															<SelectItem value='non_resolu'>
																Non résolu
															</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
										</CardContent>
									</Card>
									<Card
										className='overflow-hidden'
										x-chunk='dashboard-07-chunk-4'
									>
										<CardHeader>
											<CardTitle>Details de l&apos;Intervention</CardTitle>
											<CardDescription>
												Lipsum dolor sit amet, consectetur adipiscing elit
											</CardDescription>
										</CardHeader>
										<CardContent>
											<div></div>
											<Button size='lg' type="submit"
														variant="outline"
														onClick={() => {
															toast({
																title: "✅ Demande envoyée avec succès !",
																description: "Cette action ne peut pas être annulée. Cela modifiera directement vos données du serveur.",
															})
														}}
													>
														Enregistrer
											</Button>
											{/* <AlertDialog>
												<AlertDialogTrigger asChild>
												<Button size='lg' type="submit">
													Enregistrer
												</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>✅ Demande envoyée avec succès !</AlertDialogTitle>
														<AlertDialogDescription>
														Cette action ne peut pas être annulée. Cela modifiera directement vos données du serveur.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction>Ok</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog> */}
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
						</div>
					</main>
				</div>
			</div>
    </form>
    </div>
  )
}


export default RequestForm;