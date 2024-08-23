"use client";

import { useToast } from "@/components/ui/use-toast";

import { db } from "@/lib/firebaseConfig";
import { User, getAuth, onAuthStateChanged, signOut, updatePassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Ajoutez cette ligne pour importer getDoc
import { CirclePlus } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import Progress from "@/tools/progress";

const Account = () => {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<{
		uid: string;
		email: string;
		lastName: string;
		firstName: string;
		pseudo?: string;
		direction?: string;
		location?: string;
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const auth = getAuth();

	const [newEmail, setNewEmail] = useState("");
	const [newLastName, setNewLastName] = useState("");
	const [newFirstName, setNewFirstName] = useState("");
	const [newPseudo, setNewPseudo] = useState("");
	const [newDirection, setNewDirection] = useState("");
	const [newLocation, setNewLocation] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);

	const { toast } = useToast();

	const [open, setOpen] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [direction, setDirection] = useState("");
	const [email, setEmail] = useState("");
	const [ip, setIp] = useState("");
	const [localisationTour, setLocalisationTour] = useState("");
	const [localisationEtagePorte, setLocalisationEtagePorte] = useState("");
	const [pseudo, setPseudo] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAddUser = async () => {
		if (!user) {
			console.error("Utilisateur non trouvé");
			setIsSubmitting(false);
			return; // Ajouté pour gérer le cas où l'utilisateur est null
		}
		setIsSubmitting(true);
		const userDocRef = doc(db, "admins", user.uid);
		try {
			await updateDoc(userDocRef, {
				firstName,
				lastName,
				direction,
				email,
				ip,
				localisationTour,
				localisationEtagePorte,
				pseudo,
				phoneNumber,
				...(newPassword && { password: newPassword }),
			});
			console.log("Informations de l'utilisateur mises à jour avec succès");
			setOpen(false);
		} catch (error) {
			console.error("Erreur lors de la mise à jour des informations:", error);
		}
		setIsSubmitting(false);
	};

	const handleUpdate = async () => {
		setIsUpdating(true);
		if (user) {
			const userDocRef = doc(db, "admins", user.uid);
			try {
				await updateDoc(userDocRef, {
					email: newEmail || (userData?.email ?? ""),
					lastName: newLastName || (userData?.lastName ?? ""),
					firstName: newFirstName || (userData?.firstName ?? ""),
					pseudo: newPseudo,
					direction: newDirection,
					location: newLocation,
				});
				if (newPassword) {
					await updatePassword(user, newPassword);
				}
				console.log("Informations mises à jour avec succès");
				setUserData({
					uid: user.uid,
					email: newEmail || (userData?.email ?? ""),
					lastName: newLastName || (userData?.lastName ?? ""),
					firstName: newFirstName || (userData?.firstName ?? ""),
					pseudo: newPseudo,
					direction: newDirection,
					location: newLocation,
				});
			} catch (error) {
				console.error("Erreur lors de la mise à jour des informations:", error);
			}
		}
		setIsUpdating(false);
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			console.log("Déconnexion réussie");
			router.push("/");
		} catch (error) {
			console.error("Erreur lors de la déconnexion:", error);
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
						pseudo?: string;
						direction?: string;
						location?: string;
					};
					
					setUserData({
						uid: user.uid,
						email: data.email,
						lastName: data.lastName,
						firstName: data.firstName,
						pseudo: data.pseudo,
						direction: data.direction,
						location: data.location,
					});
				} else {
					console.log("Aucune donnée utilisateur trouvée pour l'UID:", user.uid);
				}
			} else {
				console.log("Utilisateur non connecté");
				router.push("/auth");
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, [auth, router]);

	if (loading) {
		return <div><Progress /></div>;
	}

	if (!userData) {
		return <p>Aucune donnée utilisateur disponible.</p>;
	}

	return (
		<div>
			<main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mx-6'>
				<div className='flex items-center'>
					<h1 className='text-lg font-semibold md:text-2xl'>
						Bienvenue, {userData.lastName} {userData.firstName}
					</h1>
				</div>

				<div className='flex flex-col gap-4'>
					<div>
						<Card>
								<CardHeader>
									<CardTitle>mon Compte</CardTitle>
									<CardDescription>
										Retrouver toutes vos informations de compte. 
								</CardDescription>
								</CardHeader>
								<CardContent>
									<form className="flex flex-col items-center gap-4">
										<div className="flex flex-col items-center space-y-2 w-full max-w-[700px]">
											<label
													htmlFor="email"
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													Votre Email
											</label>
											<Input id="email" placeholder="Votre email" defaultValue={userData.email} className="w-full" />
										</div>
										<div className="flex flex-col items-center space-y-2 w-full max-w-[700px]">
											<label
													htmlFor="pseudo"
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													Votre Pseudo
												</label>
											<Input id="pseudo" placeholder="Votre Pseudo" defaultValue={userData.pseudo} className="w-full" />
										</div>
										<div className="flex flex-col items-center space-y-2 w-full max-w-[700px]">
											<label
													htmlFor="direction"
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													Votre Direction
											</label>
											<Input id="direction" placeholder="Votre Direction" defaultValue={userData.direction} className="w-full" />
										</div>
										<div className="flex flex-col items-center space-y-2 w-full max-w-[700px]">
											<label
													htmlFor="location"
													className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
												>
													Votre Localisation
											</label>
											<Input id="location" placeholder="Votre Localisation" defaultValue={userData.location} className="w-full" />
										</div>
									</form>
								</CardContent>
						</Card>
					</div>
					<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <CirclePlus className='h-3.5 w-3.5' /> <span>Modifier vos informations</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier les informations de l&apos;utilisateur</DialogTitle>
          <DialogDescription>
            Entrez les nouvelles informations de l&apos;utilisateur ci-dessous. Cliquez sur enregistrer lorsque vous avez terminé.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              Prénom
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Nom
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="direction" className="text-right">
              Direction
            </Label>
            <Input
              id="direction"
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ip" className="text-right">
              IP
            </Label>
            <Input
              id="ip"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Localisation (Tour)
            </Label>
            <Input
              id="location"
              value={localisationTour}
              onChange={(e) => setLocalisationTour(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Localisation (Etage/Porte)
            </Label>
            <Input
              id="location"
              value={localisationEtagePorte}
              onChange={(e) => setLocalisationEtagePorte(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pseudo" className="text-right">
              Pseudo
            </Label>
            <Input
              id="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Numéro de téléphone
            </Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              Nouveau Mot de Passe
            </Label>
            <Input
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-3"
              type="password"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddUser} disabled={isSubmitting}>
            {isSubmitting ? "Mise à jour en cours..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
					{/* <Button onClick={handleLogout}>Se déconnecter</Button> */}
				</div>
			</main>
		</div>
	);
};

export default Account;