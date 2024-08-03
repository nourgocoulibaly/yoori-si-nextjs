"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { db } from "@/lib/firebaseConfig";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";



export default function SidebarDemo({ children }: { children: ReactNode }) {

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
	const router = useRouter();

	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.body.classList.add("dark"); // Ajouter la classe "dark" par défaut
			setDarkMode(true); // S'assurer que le state est synchronisé
		}
	}, []);

  const handleThemeToggle = () => {
		if (typeof document !== 'undefined') {
			document.body.classList.toggle("dark");
			setDarkMode(document.body.classList.contains("dark"));
		}
	};

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

  // const handleLogout = async () => {
	// 	try {
	// 		await signOut(auth);
	// 		console.log("Déconnexion réussie");
	// 		router.push("/");
	// 	} catch (error) {
	// 		console.error("Erreur lors de la déconnexion:", error);
	// 	}
	// };


  const links = [
    {
      label: "Dashboard",
      href: "/adminDashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Intervention",
      href: "/adminRequests",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Parametre",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Deconnexion",
      href: "/",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[60vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: `${userData?.lastName} ${userData?.firstName}`,
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
						<Switch id="dark-mode" onClick={handleThemeToggle} />
						<Label htmlFor="dark-mode">{darkMode ? "Mode Clair" : "Mode Sombre"}</Label>
					</div>
        </SidebarBody>
      </Sidebar>
      {children}
      {/* <Dashboard /> */}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Yoori SI
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

// // Dummy dashboard component with content
// const Dashboard = () => {
//   return (
//     <div className="flex flex-1">
//       <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
//         <div className="flex gap-2">
//           {[...new Array(4)].map((i) => (
//             <div
//               key={"first-array" + i}
//               className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//             ></div>
//           ))}
//         </div>
//         <div className="flex gap-2 flex-1">
//           {[...new Array(2)].map((i) => (
//             <div
//               key={"second-array" + i}
//               className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
//             ></div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };