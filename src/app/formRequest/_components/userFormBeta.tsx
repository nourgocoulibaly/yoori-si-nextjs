"use client"

import { useAuth } from "@/contexts/AuthContext";

// Importer LegacyRef pour convertir le type de référence en HTMLSelectElement
import { LegacyRef } from 'react';

import { db } from "@/lib/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
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

interface User {
  uid: string;
  firstName: string;
  lastName: string;
  direction: string;
}

const UserFormBeta = () => {

    const requestContentRef = useRef<HTMLTextAreaElement>(null);
    const requestDomainRef = useRef<HTMLButtonElement>(null);
    // Supprimez la référence pour le statut
    // const requestStatusRef = useRef<HTMLButtonElement>(null);

  // Ajoutez un état pour le statut
  const [status, setStatus] = useState("En attente");

  // Contexte d'Authentification

  const { currentUser } = useAuth() as { currentUser: User | null };

	const fullName = currentUser
		? `${currentUser.firstName} ${currentUser.lastName}`
		: "";

	const direction = currentUser ? currentUser.direction : "";


    const handleSubmit = async (e: React.FormEvent) => {

      e.preventDefault();

     const requestContent = requestContentRef.current?.value;
      const requestDomain = requestDomainRef.current?.textContent; // Modifier la récupération de la valeur
      // const requestStatus = requestStatusRef.current?.textContent;  // Modifier la récupération de la valeur

      console.log("🟢", requestContent, ",", requestDomain, ",", status);

      // if (!requestContent) {
      //   alert("⛔Le champ nature de l'intervention est obligatoire");
      //   return;
      // }

      try {
        await addDoc (collection(db, "userRequests"), {
          userId: currentUser?.uid,
          userName: fullName,
          userDirection: direction,
          requestContent,
          requestDomain,
          requestStatus: status, // Utilisez l'état du statut
          createdAt: serverTimestamp() // Ajouter la date et l'heure de création
        })
        alert ("✅ Demande envoyée avec succès !");


        requestContentRef.current!.value = "";
				requestDomainRef.current!.textContent = ""; // Modifier la réinitialisation
				setStatus("En attente"); // Réinitialisez le statut à "En attente"

        console.log("✅ Données envoyées avec succès !");
				// setError(null);

      } catch (error) {
        console.log("⛔Impossible d'ajouter au document", error);
        alert("⛔Erreur d'Enregistrement, Reessayer plus tard!");
      }
    };

  return (

    <form onSubmit={handleSubmit}>
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
													<Label htmlFor='content'>
														Nature de l&apos;Intervention
													</Label>
													<Textarea
														id='requestRef'
														ref={requestContentRef}
														placeholder="Entrer la nature de l'intervention"
														className='min-h-32'
														required
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
                                name='domain'
																aria-label='Selectionner'
                                ref={requestDomainRef as LegacyRef<HTMLButtonElement>}
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
													<Label htmlFor='domain'>
														Logiciels & Applications
													</Label>
													<Select>
														<SelectTrigger
															id='domain'
                              name='domain'
                              aria-label='Selectionner'
                              ref={requestDomainRef as LegacyRef<HTMLButtonElement>}
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
													<Label htmlFor='domain'>Reseau</Label>
													<Select>
														<SelectTrigger
															id='domain'
                              name='domain'
															aria-label='Selectionner'
                              ref={requestDomainRef as LegacyRef<HTMLButtonElement>}
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
													<Select value={status} onValueChange={setStatus}>
														<SelectTrigger
															id='status'
                              name='status'
															aria-label='Selectionner'
														>
															<SelectValue placeholder='En attente' />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='En attente'>En attente</SelectItem>
															<SelectItem value='Resolu'>
																Résolu
															</SelectItem>
															<SelectItem value='Non resolu'>
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
											<Button size='lg' type="submit">
												Enregistrer
											</Button>
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>


{/*     
    <div className="flex justify-center items-center flex-col gap-4">
      <label htmlFor="content">Demande</label>
      <textarea ref={requestContentRef} id="content" name="content" placeholder="Votre demande"></textarea>
      <label htmlFor="domain">Domaine</label>
      <select ref={requestDomainRef} id="domain" name="domain">
        <option value="domaine1">Domaine 1</option>
        <option value="domaine2">Domaine 2</option>
      </select>
      <label htmlFor="category">Categorie</label>
      <select ref={requestCategoryRef} id="category" name="category">
        <option value="category1">Categorie 1</option>
        <option value="category2">Categorie 2</option>
      </select>
    </div>
    <button type="submit" className="   bg-blue-500 text-white p-2 rounded-md">Enregistrer</button> */}
    </form>
  )
}

export default UserFormBeta
