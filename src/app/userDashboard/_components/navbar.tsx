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
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Package2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importation de useRouter
import React from "react";

import { db } from "@/lib/firebaseConfig";
import { User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";



export default function UserNavbar({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter(); // Utilisation de useRouter
	const [darkMode, setDarkMode] = React.useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<{
		uid: string;
		email: string;
		lastName: string;
		firstName: string;
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const auth = getAuth();

	const handleThemeToggle = () => {
		document.body.classList.toggle("dark");
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				console.log("Utilisateur connecté:", user);
				setUser(user);
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);
				if (userDoc.exists()) {
					const data = userDoc.data() as {
						email: string;
						lastName: string;
						firstName: string;
					};
					setUserData({
						uid: user.uid, // Ajout de l'UID ici
						email: data.email,
						lastName: data.lastName,
						firstName: data.firstName,
					});
				} else {
					console.log(
						"Aucune donnée utilisateur trouvée pour l'UID:",
						user.uid
					);
				}
			} else {
				console.log("Utilisateur non connecté");
				router.push("/auth"); // Redirection vers la page d'authentification
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth, router]); // Ajout de router dans les dépendances

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
						href="/adminDashboard"
						className='flex items-center gap-2 text-lg font-semibold md:text-base'
					>
						<Package2 className='h-6 w-6' />
						<span className='sr-only'>Yoori SI</span>
					</Link>
					<Link	
						href="/userDashboard"
						className='text-foreground transition-colors hover:text-foreground'
					>
						Dashboard
					</Link>
					
					<Link
						href="/formRequest"
						className='text-muted-foreground transition-colors hover:text-foreground w-full cursor-pointer'
					>
						Intervention
					</Link>
				</nav>
				<Sheet>
				<SheetContent side='left'>
						<nav className='grid gap-6 text-lg font-medium'>
					<Link	
						href="/adminDashboard"
						className='flex items-center gap-2 text-lg font-semibold md:text-base'
					>
						<Package2 className='h-6 w-6' />
						<span className='sr-only'>Yoori SI</span>
					</Link>
					<Link	
						href="/userDashboard"
						className='text-foreground transition-colors hover:text-foreground'
					>
						Dashboard
					</Link>
					<Link
						href="/formRequest"
						className='text-muted-foreground transition-colors hover:text-foreground w-full'
					>
						Intervention
					</Link>

						</nav>
					</SheetContent>
				</Sheet>


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
                  <Image
                    src={`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${userData?.firstName}`}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />             
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
					<div className="flex items-center space-x-2">
						<Switch id="dark-mode" onClick={handleThemeToggle} />
						<Label htmlFor="dark-mode">{darkMode ? "Mode Clair" : "Mode Sombre"}</Label>
					</div>
				</div>
			</header>
			{children}
		</>
	);
}