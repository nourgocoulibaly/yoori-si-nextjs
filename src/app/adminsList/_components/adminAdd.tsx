"use client";

import { CirclePlus } from 'lucide-react';
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
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  direction: string;
  email: string;
  ip?: string;
  location?: string;
}

interface AddUserDialogProps {
  onSave: (user: User) => void;
}

export function AddAdminDialog({ onSave }: AddUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [direction, setDirection] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ip, setIp] = useState("");
  const [location, setLocation] = useState("");
  const { toast } = useToast();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const handleAddUser = async () => {
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "L'email et le mot de passe sont requis.",
        variant: 'destructive',
      });
      return;
    }

    try {
      // Créer un compte utilisateur avec email et mot de passe
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Créer l'objet utilisateur avec les données supplémentaires
      const newUser: User = {
        id: userId,
        firstName,
        lastName,
        direction,
        email,
        ip,
        location,
      };

      // Ajouter les informations de l'utilisateur dans Firestore dans la collection 'admins'
      await addDoc(collection(db, "admins"), newUser);

      toast({
        title: "✅ Utilisateur ajouté avec succès !",
        description: "L'utilisateur a été ajouté à la base de données et un compte a été créé.",
      });

      // Appeler la fonction onSave pour notifier le parent de l'ajout
      onSave(newUser);

    } catch (e) {
      console.error("Erreur lors de l'ajout de l'utilisateur: ", e);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du compte. Veuillez réessayer.",
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><CirclePlus className='h-3.5 w-3.5' /> <span>Ajouter</span></Button>
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
            <Label htmlFor="password" className="text-right">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Localisation
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddUser}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
