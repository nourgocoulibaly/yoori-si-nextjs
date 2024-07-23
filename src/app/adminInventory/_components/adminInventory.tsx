"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AdminInventory() {
	return (
		<div className='flex min-h-screen w-full flex-col bg-muted/40'>
			<Breadcrumb className='hidden md:flex mt-10 ml-14'>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href='/adminDashboard'>Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href='/adminInventory'>Ajouter un Inventaire</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href='/adminInventory/InventoryList'>
								Tous les Inventaires
							</Link>
						</BreadcrumbLink>
						{/* <BreadcrumbPage>Tous les inventaires</BreadcrumbPage> */}
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
				<div className='flex items-center'>
					<h1 className='text-lg font-semibold md:text-2xl'>Inventaire</h1>
				</div>
				<div
					className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'
					x-chunk='dashboard-02-chunk-1'
				>
					<div className='flex flex-col items-center gap-1 text-center'>
						<h3 className='text-2xl font-bold tracking-tight'>
							Vous n&apos;avez aucun produit
						</h3>
						<p className='text-sm text-muted-foreground'>
							Vous pouvez commencer à vendre dès que vous ajoutez un produit.{" "}
						</p>
						<Button className='mt-4'>Ajouter un produit</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
