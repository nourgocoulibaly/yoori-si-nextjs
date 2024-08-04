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
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { User, getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Badge from '@mui/material/Badge';

import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

async function getNewRequestsCountFromAPI(): Promise<number> {
  // Implémentez la logique pour récupérer le nombre de nouvelles requêtes
  // Par exemple, une requête API
  const response = await fetch('/api/new-requests-count');
  const data = await response.json();
  return data.count;
}

export default function AdminNavbar({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [darkMode, setDarkMode] = useState(true); // Par défaut en mode "dark"
	const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{
		uid: string;
		email: string;
		lastName: string;
		firstName: string;
	} | null>(null);
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [newRequestsCount, setNewRequestsCount] = useState(0);


	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.body.classList.add("dark"); // Ajouter la classe "dark" par défaut
			setDarkMode(true); // S'assurer que le state est synchronisé
		}
	}, []);

	useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Utilisateur connecté:", user);
        setUser(user);
        const userDocRef = doc(db, "admins", user.uid);
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

	useEffect(() => {
		const fetchNewRequestsCount = async () => {
			const count = await getNewRequestsCountFromAPI();
			setNewRequestsCount(count);
		};

		fetchNewRequestsCount();
	}, []);

	const handleThemeToggle = () => {
		if (typeof document !== 'undefined') {
			document.body.classList.toggle("dark");
			setDarkMode(document.body.classList.contains("dark"));
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			console.log("Déconnexion réussie");
			router.push("/adminAuth");
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
		}
	};

	return (
    <>
      <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 bg-opacity-100'>
          <Link
            href="/home"
            className='flex items-center gap-2 text-lg font-semibold md:text-base'
          >
          <Image
            src={`/YooriLinkNavbar.png`}
            className="w-72 h-auto mr-35"
            alt="Logo Yoori Link"
            loading="lazy"
          />
          <span className='sr-only'>Yoori SI</span>
        </Link>
        <nav className='hidden md:flex items-center justify-between gap-6 text-lg font-medium md:gap-5 md:text-sm lg:gap-6 ml-10'>
        <Link
          href="/adminDashboard"
          className='text-foreground transition-colors hover:text-foreground'
        >
              {newRequestsCount > 0 && (
                <Badge badgeContent={newRequestsCount} color="primary">
                  Dashboard
                </Badge>
              )}
        </Link>
        <Link
          href="/adminRequests"
          className='text-muted-foreground transition-colors hover:text-foreground w-full'
        >
              {newRequestsCount > 0 && (
                <Badge badgeContent={newRequestsCount} color="primary">
                  Intervention
                </Badge>
              )}
        </Link>
        <Link
          href="/adminInventory"
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          Inventaires
        </Link>
        <Link
          href="/adminChatbot"
          className='text-muted-foreground transition-colors hover:text-foreground'
        >
          ChatBot
        </Link>
      </nav>
      <Sheet>
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
              href="/home"
              className='flex items-center gap-2 text-lg font-semibold md:text-base'
            >
              <Image
                src={`/YooriLink.png`}
                className="h-7 w-7 flex-shrink-0 rounded-full"
                width={50}
                height={50}
                alt="Logo Yoori Link"
              />
              <span className='sr-only'>Yoori SI</span>
            </Link>
            <Link
              href="/adminDashboard"
              className='text-foreground transition-colors hover:text-foreground'
            >
              Dashboard
            </Link>
            <Link
              href="/adminRequests"
              className='text-muted-foreground transition-colors hover:text-foreground w-full'
            >
              Intervention
            </Link>
            <Link
              href="/adminInventory"
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              Inventaires
            </Link>
            <Link
              href="/adminChatbot"
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              ChatBot
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <form className='ml-auto flex-1 sm:flex-initial'>
          <div className='relative'>
            Salut🖐️, {userData?.lastName} {userData?.firstName}
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
            <DropdownMenuLabel asChild>
              <Link href="/account/adminAccount">Mon Compte</Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Se déconnecter
            </DropdownMenuItem>
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