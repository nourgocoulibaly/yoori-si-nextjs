"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { CircleUser, Package2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Correction de l'importation ici
import React from "react";

export default function AdminNavbar({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter(); // Utilisation de useRouter
	const [darkMode, setDarkMode] = React.useState(false);

	const handleThemeToggle = () => {
		document.body.classList.toggle("dark");
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			console.log("Déconnexion réussie");
			router.push("/"); // Redirection après déconnexion
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
		}
	};

	return (
		<>
			<header
				className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 ${
				darkMode ? "bg-dark" : "bg-light"
			}'
			>
				<nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
					<Link
						href='#'
						className='flex items-center gap-2 text-lg font-semibold md:text-base'
					>
						<Package2 className='h-6 w-6' />
						<span className='sr-only'>Yoori SI</span>
					</Link>
					<Link
						href='/adminDashboard'
						className='text-foreground transition-colors hover:text-foreground'
					>
						Dashboard
					</Link>
					<Link
						href='/adminRequests'
						className='text-muted-foreground transition-colors hover:text-foreground w-full'
					>
						Intervention
					</Link>
					<Link
						href='/adminInventory'
						className='text-muted-foreground transition-colors hover:text-foreground'
					>
						Inventaires
					</Link>
					<Link
						href='#'
						className='text-muted-foreground transition-colors hover:text-foreground'
					>
						ChatBot
					</Link>
					{/* <Link
						href='#'
						className='text-muted-foreground transition-colors hover:text-foreground'
					>
						Analytics
					</Link> */}
				</nav>
				{/* <Sheet>
					<SheetTrigger asChild>
						<Button
							variant='outline'
							size='icon'
							className='shrink-0 md:hidden'
						>
							<Menu className='h-5 w-5' />
							<span className='sr-only'>Toggle navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side='left'>
						<nav className='grid gap-6 text-lg font-medium'>
							<Link
								href='#'
								className='flex items-center gap-2 text-lg font-semibold'
							>
								<Package2 className='h-6 w-6' />
								<span className='sr-only'>Yoori SI</span>
							</Link>
							<Link href='#' className='hover:text-foreground'>
								Dashboard
							</Link>
							<Link
								href='#'
								className='text-muted-foreground hover:text-foreground'
							>
								Orders
							</Link>
							<Link
								href='#'
								className='text-muted-foreground hover:text-foreground'
							>
								Products
							</Link>
							<Link
								href='#'
								className='text-muted-foreground hover:text-foreground'
							>
								Customers
							</Link>
							<Link
								href='#'
								className='text-muted-foreground hover:text-foreground'
							>
								Analytics
							</Link>
						</nav>
					</SheetContent>
				</Sheet> */}
				<div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
					<form className='ml-auto flex-1 sm:flex-initial'>
						<div className='relative'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Rechercher...'
								className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]'
							/>
						</div>
					</form>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='secondary' size='icon' className='rounded-full'>
								<CircleUser className='h-5 w-5' />
								<span className='sr-only'>Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>q
						<DropdownMenuContent align='end'>
							<a href="/account"><DropdownMenuLabel>Mon Compte</DropdownMenuLabel></a>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Paramètres</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout}>
								Se déconnecter
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button onClick={handleThemeToggle}>
						{document.body.classList.contains("dark")
							? "Mode Clair"
							: "Mode Sombre"}
					</Button>
				</div>
			</header>
			{children}
		</>
	);
}
