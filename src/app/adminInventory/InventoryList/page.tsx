"use client"

import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import AdminNavbar from "@/app/adminDashboard/_components/navbar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function InventoryList() {
	const router = useRouter();

	useEffect(() => {
		// Code qui accède à `document`
		if (typeof document !== 'undefined') {
			console.log(document.title);
		}
	}, []);

	return (
		<div className='flex min-h-screen w-full flex-col bg-muted/40'>
			<AdminNavbar>
				<Breadcrumb className='hidden md:flex mt-10 ml-14'>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<a onClick={() => router.push('/adminDashboard')}>Dashboard</a>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<a onClick={() => router.push('/adminInventory')}>Ajouter un Inventaire</a>
							</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<a onClick={() => router.push('/adminInventory/InventoryList')}>
									Tous les Inventaires
								</a>
							</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
				<main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
					<Tabs defaultValue='all'>
						<div className='flex items-center mt-10'>
							<TabsList>
								<TabsTrigger value='all'>Tout</TabsTrigger>
								<TabsTrigger value='active'>Active</TabsTrigger>
								<TabsTrigger value='draft'>Brouillon</TabsTrigger>
								<TabsTrigger value='archived' className='hidden sm:flex'>
									Archivé
								</TabsTrigger>
							</TabsList>
							<div className='ml-auto flex items-center gap-2'>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='outline' size='sm' className='h-7 gap-1'>
											<ListFilter className='h-3.5 w-3.5' />
											<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
												Filtre
											</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuLabel>Filtrer par</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem checked>
											Active
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>
											Brouillon
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem>Archivé</DropdownMenuCheckboxItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<Button size='sm' variant='outline' className='h-7 gap-1'>
									<File className='h-3.5 w-3.5' />
									<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
										Export
									</span>
								</Button>
								<Button size='sm' className='h-7 gap-1'>
									<PlusCircle className='h-3.5 w-3.5' />
									<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
										Ajouter un Inventaire
									</span>
								</Button>
							</div>
						</div>
						<TabsContent value='all'>
							<Card x-chunk='dashboard-06-chunk-0'>
								<CardHeader>
									<CardTitle>Produits</CardTitle>
									<CardDescription>
										Gérez vos produits et visualisez leurs performances de
										vente.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className='hidden w-[100px] sm:table-cell'>
													<span className='sr-only'>Image</span>
												</TableHead>
												<TableHead>Nom</TableHead>
												<TableHead>Statuts</TableHead>
												<TableHead>Prix</TableHead>
												<TableHead className='hidden md:table-cell'>
													Ventes totales
												</TableHead>
												<TableHead className='hidden md:table-cell'>
													Créé à
												</TableHead>
												<TableHead>
													<span className='sr-only'>Actions</span>
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell className='hidden sm:table-cell'>
													<Image
														alt='Product image'
														className='aspect-square rounded-md object-cover'
														height='64'
														src='/vercel.svg'
														width='64'
													/>
												</TableCell>
												<TableCell className='font-medium'>
													Laser Lemonade Machine
												</TableCell>
												<TableCell>
													<Badge variant='outline'>Brouillon</Badge>
												</TableCell>
												<TableCell>$499.99</TableCell>
												<TableCell className='hidden md:table-cell'>
													25
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-07-12 10:42 AM
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																aria-haspopup='true'
																size='icon'
																variant='ghost'
															>
																<MoreHorizontal className='h-4 w-4' />
																<span className='sr-only'>
																	Basculer le menu
																</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuItem>Modifier</DropdownMenuItem>
															<DropdownMenuItem>Supprimer</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='hidden sm:table-cell'>
													<Image
														alt='Product image'
														className='aspect-square rounded-md object-cover'
														height='64'
														src='/placeholder.svg'
														width='64'
													/>
												</TableCell>
												<TableCell className='font-medium'>
													Hypernova Headphones
												</TableCell>
												<TableCell>
													<Badge variant='outline'>Active</Badge>
												</TableCell>
												<TableCell>$129.99</TableCell>
												<TableCell className='hidden md:table-cell'>
													100
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-10-18 03:21 PM
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																aria-haspopup='true'
																size='icon'
																variant='ghost'
															>
																<MoreHorizontal className='h-4 w-4' />
																<span className='sr-only'>
																	Basculer le menu
																</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuItem>Modifier</DropdownMenuItem>
															<DropdownMenuItem>Supprimer</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='hidden sm:table-cell'>
													<Image
														alt='Product image'
														className='aspect-square rounded-md object-cover'
														height='64'
														src='/placeholder.svg'
														width='64'
													/>
												</TableCell>
												<TableCell className='font-medium'>
													AeroGlow Desk Lamp
												</TableCell>
												<TableCell>
													<Badge variant='outline'>Active</Badge>
												</TableCell>
												<TableCell>$39.99</TableCell>
												<TableCell className='hidden md:table-cell'>
													50
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-11-29 08:15 AM
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																aria-haspopup='true'
																size='icon'
																variant='ghost'
															>
																<MoreHorizontal className='h-4 w-4' />
																<span className='sr-only'>
																	Basculer le menu
																</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuItem>Modifier</DropdownMenuItem>
															<DropdownMenuItem>Supprimer</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='hidden sm:table-cell'>
													<Image
														alt='Product image'
														className='aspect-square rounded-md object-cover'
														height='64'
														src='/placeholder.svg'
														width='64'
													/>
												</TableCell>
												<TableCell className='font-medium'>
													TechTonic Energy Drink
												</TableCell>
												<TableCell>
													<Badge variant='secondary'>Draft</Badge>
												</TableCell>
												<TableCell>$2.99</TableCell>
												<TableCell className='hidden md:table-cell'>
													0
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2023-12-25 11:59 PM
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																aria-haspopup='true'
																size='icon'
																variant='ghost'
															>
																<MoreHorizontal className='h-4 w-4' />
																<span className='sr-only'>
																	Basculer le menu
																</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuItem>Modifier</DropdownMenuItem>
															<DropdownMenuItem>Supprimer</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='hidden sm:table-cell'>
													<Image
														alt='Product image'
														className='aspect-square rounded-md object-cover'
														height='64'
														src='/placeholder.svg'
														width='64'
													/>
												</TableCell>
												<TableCell className='font-medium'>
													Gamer Gear Pro Controller
												</TableCell>
												<TableCell>
													<Badge variant='outline'>Active</Badge>
												</TableCell>
												<TableCell>$59.99</TableCell>
												<TableCell className='hidden md:table-cell'>
													75
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2024-01-01 12:00 AM
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																aria-haspopup='true'
																size='icon'
																variant='ghost'
															>
																<MoreHorizontal className='h-4 w-4' />
																<span className='sr-only'>Toggle menu</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuItem>Modifier</DropdownMenuItem>
															<DropdownMenuItem>Supprimer</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='hidden sm:table-cell'>
													<Image
														alt='Product image'
														className='aspect-square rounded-md object-cover'
														height='64'
														src='/placeholder.svg'
														width='64'
													/>
												</TableCell>
												<TableCell className='font-medium'>
													Luminous VR Headset
												</TableCell>
												<TableCell>
													<Badge variant='outline'>Active</Badge>
												</TableCell>
												<TableCell>$199.99</TableCell>
												<TableCell className='hidden md:table-cell'>
													30
												</TableCell>
												<TableCell className='hidden md:table-cell'>
													2024-02-14 02:14 PM
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																aria-haspopup='true'
																size='icon'
																variant='ghost'
															>
																<MoreHorizontal className='h-4 w-4' />
																<span className='sr-only'>Toggle menu</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuLabel>Actions</DropdownMenuLabel>
															<DropdownMenuItem>Modifier</DropdownMenuItem>
															<DropdownMenuItem>Supprimer</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</CardContent>
								<CardFooter>
									<div className='text-xs text-muted-foreground'>
										Affichage <strong>1-10</strong> des <strong>32</strong>{" "}
										produits
									</div>
								</CardFooter>
							</Card>						</TabsContent>
					</Tabs>
				</main>
			</AdminNavbar>
		</div>
	);
}
