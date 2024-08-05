"use client"

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
import { getAuth, updatePassword } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore"; // Importer les fonctions nécessaires
import { useEffect, useState } from 'react';
import { getUserList } from '../api/utils'; // Mise à jour du chemin d'accès

import { useToast } from "@/components/ui/use-toast";


interface User {
  id: string;
  firstName: string;
  lastName: string;
  direction: string;
  email: string;
  ip?: string;
  location?: string;
}

export function DataModif({ user, onSave }: { user: User; onSave: (user: User) => void }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [direction, setDirection] = useState(user.direction);
  const [email, setEmail] = useState(user.email);
  const [ip, setIp] = useState(user.ip || '');
  const [location, setLocation] = useState(user.location || '');
  const [password, setPassword] = useState('');
  const [userList, setUserList] = useState<User[]>([]);

  const { toast } = useToast();


  useEffect(() => {
    async function fetchData() {
      const users = await getUserList();
      const completeUsers = users.map((user: any) => ({
        ...user,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        direction: user.direction || '',
        email: user.email || '',
        ip: user.ip || '',
        location: user.location || ''
      }));
      setUserList(completeUsers);
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    if (password) {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updatePassword(currentUser, password);
        } else {
          console.error("Aucun utilisateur authentifié");
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe:", error);
      }
    }

    const updatedUser = { ...user, firstName, lastName, direction, email, ip, location };

    // Mettre à jour les données de l'utilisateur dans Firestore
    try {
      const db = getFirestore();
      const userDoc = doc(db, "users", user.id); // Assurez-vous que l'ID de l'utilisateur est correct
      await updateDoc(userDoc, updatedUser);
      console.log("Données de l'utilisateur mises à jour avec succès dans Firestore");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données de l'utilisateur dans Firestore:", error);
    }

    onSave(updatedUser);

    // Mettre à jour la liste des utilisateurs après la sauvegarde
    const users = await getUserList();
    const completeUsers = users.map((user: any) => ({
      ...user,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      direction: user.direction || '',
      email: user.email || '',
      ip: user.ip || '',
      location: user.location || ''
    }));
    setUserList(completeUsers);
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogTrigger asChild>
        <Button variant="outline">Modifier le profil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le profil</DialogTitle>
          <DialogDescription>
          Modifiez votre profil ici. Cliquez sur Enregistrer lorsque vous avez terminé.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
            Prénoms
            </Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Nom
            </Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="direction" className="text-right">
              Direction
            </Label>
            <Input id="direction" value={direction} onChange={(e) => setDirection(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ip" className="text-right">
              IP
            </Label>
            <Input id="ip" value={ip} onChange={(e) => setIp(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Localisation
            </Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Mot de passe
            </Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => {
            handleSave();
            toast({
              title: "✅ Demande envoyée avec succès !",
              description: "Cette action ne peut pas être annulée. Cela modifiera directement vos données du serveur.",
            });
          }}>
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
