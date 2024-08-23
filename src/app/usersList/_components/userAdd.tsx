"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { app } from "@/lib/firebaseConfig"; // Assurez-vous d'importer votre configuration Firebase
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"; // Ajoutez cette ligne pour importer getDoc
import { CirclePlus } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  direction: string;
  email: string;
  ip?: string;
  localisationTour?: string;
  localisationEtagePorte?: string;
  pseudo: string;
  phoneNumber?: string;
}

interface AddUserDialogProps {
  onSave: (user: User) => void;
}

export function AddUserDialog({ onSave }: AddUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [direction, setDirection] = useState("");
  const [email, setEmail] = useState("");
  const [ip, setIp] = useState("");
  const [localisationTour, setLocalisationTour] = useState("");
  const [localisationEtagePorte, setLocalisationEtagePorte] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { toast } = useToast();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const defaultPassword = "DMISSA@2024"; // Définissez le mot de passe par défaut ici

  const handleAddUser = async () => {
    if (!email || !firstName || !lastName || !direction || !pseudo) {
      toast({
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Vérifier si le pseudo est déjà utilisé
      const pseudoQuery = query(collection(db, "users"), where("pseudo", "==", pseudo));
      const pseudoQuerySnapshot = await getDocs(pseudoQuery);
      if (!pseudoQuerySnapshot.empty) {
        throw new Error("Ce pseudo est déjà utilisé. Veuillez en choisir un autre.");
      }

      // Créer l'utilisateur avec Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, defaultPassword);
      const user = userCredential.user;

      // Mettre à jour le profil avec le nom d'affichage
      await updateProfile(user, { displayName: `${firstName} ${lastName}` });

      // Stocker des informations supplémentaires dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        firstName,
        lastName,
        direction,
        email,
        ip,
        localisationTour,
        localisationEtagePorte,
        pseudo,
        phoneNumber: phoneNumber || "", // Utiliser une chaîne vide au lieu de null
      });

      // Vérifiez si l'utilisateur a été ajouté avec succès
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("Erreur lors de l'ajout de l'utilisateur dans Firestore.");
      }

      toast({
        title: "✅ Utilisateur ajouté avec succès !",
        description: `L'utilisateur a été ajouté à la base de données. Email: ${email}, Mot de passe par défaut: ${defaultPassword}`,
      });

      onSave({
        id: user.uid,
        firstName,
        lastName,
        direction,
        email,
        ip,
        localisationTour,
        localisationEtagePorte,
        pseudo,
        phoneNumber: phoneNumber || "", // Utiliser une chaîne vide au lieu de undefined
      });
      
      // Fermer le dialogue
      setOpen(false);
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      let errorMessage = "Une erreur inconnue est survenue.";
      switch(error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Cette adresse email est déjà utilisée.";
          break;
        case 'auth/invalid-email':
          errorMessage = "L'adresse email n'est pas valide.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "La création de compte est désactivée.";
          break;
        case 'auth/weak-password':
          errorMessage = "Le mot de passe est trop faible. Il doit contenir au moins 6 caractères.";
          break;
        default:
          if (error instanceof Error) {
            errorMessage = error.message;
          }
      }
      toast({
        title: "Erreur",
        description: `Erreur lors de l'ajout de l'utilisateur : ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <CirclePlus className='h-3.5 w-3.5' /> <span>Ajouter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>
            Entrez les informations de l&apos;utilisateur ci-dessous. Cliquez sur enregistrer lorsque vous avez terminé.
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
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddUser} disabled={isSubmitting}>
            {isSubmitting ? "Ajout en cours..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}