"use client";

import AdminNavBar from "@/app/adminDashboard/_components/navbar";
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import * as React from "react";

import { db } from '@/lib/firebaseConfig';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { LegacyRef, useEffect, useRef, useState } from 'react';

import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { ChevronLeft, File } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from "@/components/extension/multi-select";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import { Document, Image, PDFDownloadLink, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const options = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
];

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10, flexGrow: 1 },
	text: { fontSize: 10, marginBottom: 20, textAlign: 'center', color: '#4daa5c' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  input: { fontSize: 12, marginBottom: 10, padding: 5, border: '1px solid #ccc' },
  textarea: { fontSize: 12, marginBottom: 10, padding: 5, border: '1px solid #ccc', minHeight: 50 },
  badge: { fontSize: 12, padding: 5, border: '1px solid #000', borderRadius: 5, display: 'flex' },

	header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

	title: {
    fontSize: 20,
    textAlign: 'center',        
    fontWeight: 900,
    marginBottom: 10,
    color: '#d9703c', 
    border: '1px solid #ccc',
    padding: 10
  },

	headerImage: {
    width: 100,
    height: 100,
		marginRight: 75,
  },

  headerTextContainer: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },

  headerText: {
    fontSize: 10,
    textAlign: 'center',
  },

	table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },

  tableRow: {
    flexDirection: 'row',
  },

  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    backgroundColor: '#f3f3f3',
		fontWeight: 900,
  },

  tableCol: {
    width: '80%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },

  tableColFull: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
		textAlign: 'center',
  },

  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  tableCell: {
    fontSize: 12,
  },
});

const MyDocument = ({ formData, params }: { formData: any, params: { id: string } }) => (
  <Document>
    <Page size="A4" style={styles.page}>
		<View style={styles.header}>  
        	<Image style={styles.headerImage} src="/mclu.png" />              
				{/* <View style={styles.headerTextContainer}>  */}
						<View style={{ alignItems: 'center' }}>  {/* Ajout de l'alignement centré */}
							<Text style={styles.headerText}>DIRECTION DE LA MODERNISATION, DE L&apos;INFORMATIQUE,</Text>       
							<Text style={styles.headerText}> DE LA SIMPLIFICATION ET DE LA SECURISATION DES ACTES</Text>       
							<Text style={styles.headerText}> (DMISSA)</Text>       
							<Text style={styles.headerText}>SOUS DIRECTION DE L&apos;INFORMATIQUE</Text>
							<Text style={styles.headerText}>********************************</Text>
							<Text style={styles.headerText}>SERVICE INFRASTRUCTURE INFORMATIQUE</Text>
						</View>
					{/* </View> */}
    	</View>

		<View style={styles.section}>
			<Text style={styles.title}>FICHE D&apos;INTERVENTION</Text>
      <Text style={styles.text}>Id de la fiche : {params.id}</Text> 
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColFull}>
              <Text style={styles.tableCell}>Nom & Prénoms: {formData.userName}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Direction/Service:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formData.userDirection}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Nature de l&apos;Intervention:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formData.requestContent}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Domaine d&apos;Intervention:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formData.requestDomain}</Text>
            </View>
          </View>
					<View style={styles.tableRow}>
            <View style={styles.tableColFull}>
              <Text style={styles.tableCell}>Date d&apos;Intervention: {new Date(formData.interventionDate).toLocaleString()}</Text>
            </View>
          </View>
         <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Description de l&apos;Intervention:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formData.requestDescription}</Text>
            </View> 
          </View>      
          <View style={styles.tableRow}>
            <View style={styles.tableColFull}>
              <Text style={styles.tableCell}>Intervenants: {formData.requestAdminSolved ? formData.requestAdminSolved.join(', ') : ''}</Text>
            </View>
          </View>
					<View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellHeader}>Statut de l&apos;Intervention:</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{formData.requestStatus}</Text>
            </View> 
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

const RequestPage = ({ params, data }: { params: { id: string }; data: any }) => {
	const router = useRouter();
	const { id } = params;
	const [request, setRequest] = useState<any>(data);
	const [formData, setFormData] = useState({
		userId: '',
		userName: '',
		userDirection: '',
		requestContent: '',
		requestDomain: '',
		requestStatus: '',
		createdAt: '',
		interventionDate: '',
		requestDescription: '',
		requestAdminSolved: [] as string[]
	});

	const pdfUrl = { pdfUrl: '' };
	const [loading, setLoading] = useState(false);
	const [date, setDate] = React.useState<Date>();

	const [value, setValue] = useState<string[]>([]);
	const [adminOptions, setAdminOptions] = useState<{ label: string; value: string }[]>([]);

	const requestContentRef = useRef<HTMLTextAreaElement>(null);
	const requestDomainRef = useRef<HTMLButtonElement>(null);
	const requestStatusRef = useRef<HTMLButtonElement>(null);
	const requestDescriptionRef = useRef<HTMLTextAreaElement>(null);
	const requestAdminSolvedRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!id) {
			router.push('/404');
		}
	}, [id, router]);

	useEffect(() => {
		if (request) {
			console.log("Données de la requête:", request);
			setFormData({
				...request,
				interventionDate: request.interventionDate ? request.interventionDate : '',
			});
		}
	}, [request]);

	useEffect(() => {
		if (id) {
			const fetchAdmins = async () => {
				try {
					const adminsCollection = collection(db, 'admins');
					const adminsSnapshot = await getDocs(adminsCollection);
					const adminsData = adminsSnapshot.docs.map(doc => {
						const data = doc.data();
						console.log("Données de l'administrateur :", data);
						return {
							label: `${data.firstName} ${data.lastName}`,
							value: `${data.firstName} ${data.lastName}`
						};
					});
					setAdminOptions(adminsData);
					console.log("Toutes les options d'administrateurs :", adminsData);
				} catch (error) {
					console.error("Erreur lors de la récupération des administrateurs :", error);
				}
			};
			
			fetchAdmins();
		}
	}, [id]);

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const updatedFormData = {
			...formData,
			requestContent: requestContentRef.current?.value || formData.requestContent,
			requestDomain: requestDomainRef.current?.textContent || formData.requestDomain,
			requestStatus: requestStatusRef.current?.textContent || formData.requestStatus,
			requestDescription: requestDescriptionRef.current?.value || formData.requestDescription,
		};

		// Filtrer les champs indéfinis
		const filteredFormData = Object.fromEntries(
			Object.entries(updatedFormData).filter(([key, value]) => value !== undefined && key !== 'createdAt')
		);

		if (!filteredFormData.requestContent || !filteredFormData.requestDomain || !filteredFormData.requestStatus) {
			alert("⛔Veuillez remplir tous les champs");
			setLoading(false);
			return;
		}

		if (id) {
			try {
				const docRef = doc(db, 'userRequests', id as string);
				await updateDoc(docRef, filteredFormData);

				// Mettre à jour l'état avec les nouvelles valeurs
				setFormData(filteredFormData as typeof formData);

				// Réinitialiser les champs du formulaire
				requestContentRef.current!.value = "";
				requestDomainRef.current!.textContent = "";
				requestStatusRef.current!.textContent = "";
				requestDescriptionRef.current!.value = "";
				requestAdminSolvedRef.current!.textContent = "";

			} catch (error) {
				console.log("⛔Impossible d'ajouter au document", error);
				alert("⛔Erreur d'Enregistrement, Reessayer plus tard!");
			}
		}
		setLoading(false);
	};

	const updateAdminsInFirestore = async (selectedAdmins: string[]) => {
		try {
			const docRef = doc(db, 'userRequests', id as string);
			await updateDoc(docRef, { requestAdminSolved: selectedAdmins });
			console.log('Intervenants mis à jour avec succès dans Firestore');
		} catch (error) {
			console.error('Erreur lors de la mise à jour des intervenants dans Firestore:', error);
		}
	};

	const updateDateInFirestore = async (selectedDate: Date) => {
		try {
			const formattedDate = format(selectedDate, "dd MMMM yyyy 'à' HH:mm:ss 'UTC'", { locale: fr });
			const timestamp = selectedDate.getTime(); // Convertir en timestamp
			const docRef = doc(db, 'userRequests', id as string);
			await updateDoc(docRef, { interventionDate: timestamp });
			console.log('Date d\'intervention mise à jour avec succès dans Firestore');
	
			// Mettre à jour l'état avec la nouvelle date
			setFormData(prevFormData => ({
				...prevFormData,
				interventionDate: formattedDate
			}));
		} catch (error) {
			console.error('Erreur lors de la mise à jour de la date d\'intervention dans Firestore:', error);
		}
	};

	if (!request) {
		return <div>Chargement...</div>;
	}

	// Ajoutez un bloc pour gérer les erreurs
	if (request.error) {
		return <div>Erreur: {request.error.message}</div>;
	}

	return (
		<>
			<AdminNavBar>
					<form onSubmit={handleUpdate}>
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
												<Button
													size='sm'
													variant='outline'
													className='h-7 gap-1 text-sm'
												>
													<File className='h-3.5 w-3.5' />
													<PDFDownloadLink document={<MyDocument formData={formData} params={params} />} fileName={`request_${id}.pdf`}>
														{({ blob, url, loading, error }) =>
															loading ? 'Chargement du document...' : 'Exporter'
														}
													</PDFDownloadLink>
												</Button>						
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
																	defaultValue={formData.userName}
																	disabled
																/>
															</div>
															<div className='grid gap-3'>
																<Label htmlFor='name'>Direction/Service</Label>
																<Input
																	id='direction'
																	type='text'
																	className='w-full'
																	defaultValue={formData.userDirection}
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
																	defaultValue={formData.requestContent}
																	className='min-h-32'
																/>
															</div>
														</div>
													</CardContent>
												</Card>
												<Card x-chunk='dashboard-07-chunk-2'>
													<CardHeader>
														<CardTitle>Domaine d&apos;Intervention {" "}
															<Badge variant='outline' className='ml-auto sm:ml-0'>
																{formData.requestDomain}
															</Badge>
														</CardTitle>
													</CardHeader>
													<CardContent>
														<div className='grid gap-6 sm:grid-cols-3'>
															<div className='grid gap-3'>
																<Label htmlFor='domain'>Materiels</Label>
																<Select>
																	<SelectTrigger
																		id='domain'
																		ref={requestDomainRef as LegacyRef<HTMLButtonElement>}
																		name='domain'
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
																		<SelectValue placeholder="selectionner" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value='bdfh'>
																			BDFH	
																		</SelectItem>
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
														<CardTitle>
															Statut de l&apos;Intervention {" "}
															<Badge variant='outline' className='ml-auto sm:ml-0'>
																{formData.requestStatus}
															</Badge>
														</CardTitle>
													</CardHeader>
													<CardContent>
														<div className='grid gap-6'>
															<div className='grid gap-3'>
																<Label htmlFor='status'>Status</Label>
																<Select defaultValue={formData.requestStatus}>
																	<SelectTrigger
																		id='status'
																		name='status'
																		ref={requestStatusRef as LegacyRef<HTMLButtonElement>}
																		aria-label='Selectionner'
																	>
																		<SelectValue placeholder={formData.requestStatus} />
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
														<CardTitle>Details de l&apos;Intervention
														</CardTitle>
														<CardDescription>
															Lipsum dolor sit amet, consectetur adipiscing elit
														</CardDescription>
													</CardHeader>
													<CardContent>
														<div className='grid gap-3'>
															<CardTitle>
																Date d&apos;Intervention {" "}
																<Badge variant='outline' className='ml-auto sm:ml-0'>
																	{(() => {
																			try {
																				const parsedDate = new Date(formData.interventionDate);
																				if (isValid(parsedDate)) {
																					return parsedDate.toLocaleDateString('fr-FR', {
																						day: '2-digit',
																						month: '2-digit',
																						year: 'numeric'
																					});
																				} else {
																					return 'Date non définie';
																				}
																			} catch (error) {
																				console.error('Erreur de parsing de la date:', error);
																				return 'Date non définie';
																			}
																	})()}
																</Badge>
															</CardTitle>
															<Popover>
															<PopoverTrigger asChild>
																	<Button
																			variant={"outline"}
																			className={cn(
																					"w-[240px] justify-start text-left font-normal",
																					!date && "text-muted-foreground"
																			)}
																	>
																			<CalendarIcon className="mr-2 h-4 w-4" />
																			{date ? format(date, "dd/MM/yyyy") : <span>Sélectionner une date</span>}
																	</Button>
															</PopoverTrigger>
																<PopoverContent className="w-auto p-0" align="start">
																	<Calendar
																		mode="single"
																		selected={date}
																		onSelect={(selectedDate) => {
																			setDate(selectedDate);
																			if (selectedDate) {
																				updateDateInFirestore(selectedDate);
																			}
																		}}
																		initialFocus
																	/>
																</PopoverContent>
															</Popover>

															<Label htmlFor='content'>
																Intervention
															</Label>
															<Textarea
																id='requestRef'
																ref={requestDescriptionRef}
																defaultValue={formData.requestDescription}
																className='min-h-32'
															/>													

															<CardTitle>
																Intervenants {" "}
																<Badge variant='outline' className='ml-auto sm:ml-0'>
																	{formData.requestAdminSolved ? formData.requestAdminSolved.join(',  ') : ''}
																</Badge>
															</CardTitle>
														
															<MultiSelector 
																values={value} 
																onValuesChange={(newValues) => {
																	setValue(newValues);
																	updateAdminsInFirestore(newValues);
																}} 
																loop={false} 
																className="w-[240px] justify-start text-left font-normal"
															>
																<MultiSelectorTrigger ref={requestAdminSolvedRef as LegacyRef<HTMLDivElement>}>
																	<MultiSelectorInput placeholder="Sélectionner les intervenants" />
																</MultiSelectorTrigger>
																<MultiSelectorContent>
																	<MultiSelectorList>
																		{adminOptions.map((option, i) => (
																			<MultiSelectorItem key={i} value={option.value}>
																				{option.label}
																			</MultiSelectorItem>
																		))}
																	</MultiSelectorList>
																</MultiSelectorContent>
															</MultiSelector>

															<AlertDialog>
																<AlertDialogTrigger asChild>
																<Button size='lg' type="submit">
																				{loading ? (
																					<Button disabled>
																						<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
																						Patienter...
																					</Button>
																				) : (
																					"Enregistrer"
																				)}
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
																		<AlertDialogAction>Ok</AlertDialogAction>
																	</AlertDialogFooter>
																</AlertDialogContent>
															</AlertDialog>															
														</div>
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
			</AdminNavBar>
		</>
	);
};

export default RequestPage;