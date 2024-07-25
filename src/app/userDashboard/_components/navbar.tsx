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
import { CircleUser, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importation de useRouter
import React from "react";

export default function UserNavbar({
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

	const handleNavigation = (path: string) => {
		router.push(path);
	};

	return (
		<>
			<header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
				<nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
					<Link
						href="/formRequest"
						className='text-muted-foreground transition-colors hover:text-foreground w-full cursor-pointer'
					>
						Intervention
					</Link>
				</nav>
				
				<div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
					<form className='ml-auto flex-1 sm:flex-initial'>
						<div className='relative'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search products...'
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
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<Link href="/account"><DropdownMenuLabel>Mon compte</DropdownMenuLabel></Link>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Support</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
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