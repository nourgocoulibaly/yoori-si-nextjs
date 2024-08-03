// components/UserRequestForm.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebaseConfig";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useRef, useState } from "react";


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


// Typage

interface User {
	uid: string;
	firstName: string;
	lastName: string;
	email: string;
	direction:string;
}

interface ButtonProps {
	size:"sm" | "md" | "lg";
	type:"submit" | "button";
	isLoading:boolean;
}

const UserRequestForm = () => {
	const requestContentRef = useRef<HTMLTextAreaElement>(null);
	const requestDomainRef = useRef<any>(null);
	const requestStatusRef = useRef<any>(null);
	const requestDetailsRef = useRef<any>(null);


	const [loading, setLoading] = useState(false);

	const { currentUser } = useAuth() as { currentUser: User | null };
	const fullName = currentUser
		? `${currentUser.firstName} ${currentUser.lastName}`
		: "";

	const direction = currentUser ? currentUser.direction : "";

	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (loading) return;

		const content = requestContentRef.current?.value;
		const domain = requestDomainRef.current?.textContent;
		// const status = requestStatusRef.current?.value;
		// const domain = requestDomainRef.current?.textContent;
  // Définir le statut par défaut à "En attente"
  	const status = requestStatusRef.current?.textContent || "En attente";
		const details = requestDetailsRef.current?.value;

		if (!content || !status || !details) {
			setError("⛔ Tous les champs sont requis");
			return;
		}

		if (currentUser) {
			try {
				setLoading(true);

				await addDoc(collection(db, "userRequests"), {
					userId: currentUser.uid,
					userName: fullName,
					direction: direction,
					email: currentUser.email,
					content: content,
					domain: domain,
					status: status,
					details: details,
					createdAt: Timestamp.now(),
				});

				alert("✅ Demande envoyée avec succès !");
				requestContentRef.current!.value = "";
				requestDomainRef.current!.textContent = "";
				requestStatusRef.current!.value = "";
				requestDetailsRef.current!.value = "";
				setError(null);
				setLoading(false);

				console.log("🟢 Données envoyées avec succès !");
			} catch (error: any) {
				setError(error.message);
				console.error("🔴 Erreur lors de l'envoi des données :", error);
				setLoading(false); 
			}
		}
	};

	return (
	<>
			<div className='flex min-h-screen w-full flex-col bg-muted/40'>
				<div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
					<main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
						<div className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'>
							<div className='flex items-center gap-4'>
								<Button variant='outline' size='icon' className='h-7 w-7'>
									<ChevronLeft className='h-4 w-4' />
									<span className='sr-only'>Retour</span>
								</Button>
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
														defaultValue={fullName}
														disabled
													/>
												</div>
												{/* <div className='grid gap-6'> */}
												<div className='grid gap-3'>
													<Label htmlFor='name'>Direction/Service</Label>
													<Input
														id='direction'
														type='text'
														className='w-full'
														defaultValue={direction}
														disabled
													/>
												</div>
												<div className='grid gap-3'>
													<Label htmlFor='description'>
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
													<Label htmlFor='category'>Materiels</Label>
													
														<Select>
															<SelectTrigger
																id='category'
																aria-label='Selectionner'
																ref={requestDomainRef}
															>
																<SelectValue placeholder='Selectionner' />
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
												{/* </div> */}
												<div className='grid gap-3'>
													<Label htmlFor='subcategory'>
														Logiciels & Applications
													</Label>
													<Select>
														<SelectTrigger
															id='subcategory'
															aria-label='Select subcategory'
														>
															<SelectValue placeholder='Selectionner' />
														</SelectTrigger>
														<SelectContent>
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
													<Label htmlFor='subcategory'>Reseau</Label>
													<Select>
														<SelectTrigger
															id='subcategory'
															aria-label='Select subcategory'
														>
															<SelectValue placeholder='Selectionner' />
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
															aria-label='Select status'
														>
															<SelectValue placeholder='En attente' />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='en_attente'>En attente</SelectItem>
    													<SelectItem value='resolu'>Résolu</SelectItem>
    													<SelectItem value='non_resolu'>Non résolu</SelectItem>
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
											{/* <div className='grid gap-2'>
											<Image
												alt='Product image'
												className='aspect-square w-full rounded-md object-cover'
												height='300'
												src='/placeholder.svg'
												width='300'
											/>
											<div className='grid grid-cols-3 gap-2'>
												<button>
													<Image
														alt='Product image'
														className='aspect-square w-full rounded-md object-cover'
														height='84'
														src='/placeholder.svg'
														width='84'
													/>
												</button>
												<button>
													<Image
														alt='Product image'
														className='aspect-square w-full rounded-md object-cover'
														height='84'
														src='/placeholder.svg'
														width='84'
													/>
												</button>
												<button className='flex aspect-square w-full items-center justify-center rounded-md border border-dashed'>
													<Upload className='h-4 w-4 text-muted-foreground' />
													<span className='sr-only'>Upload</span>
												</button>
											</div>
										</div> */}
										</CardContent>
									</Card>
									<Card>
									{/* <Card x-chunk='dashboard-07-chunk-5'>
										<CardHeader>
											<CardTitle>Confirmation</CardTitle>
											<CardDescription>
												Lipsum dolor sit amet, consectetur adipiscing elit.
											</CardDescription>
										</CardHeader>
										<CardContent> */}
											<div></div>
											<Button size='lg' onClick={handleSubmit} disabled={loading}>
												{loading ? "Chargement..." : 'Enregistrer'}
											</Button>
										{/* </CardContent> */}
									</Card>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
			</>
	);
};

export default UserRequestForm;
