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
import { getAuth, updatePassword } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { getUserList } from '../api/utils'; // Assurez-vous que ce chemin est correct
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
  const [dialogOpen, setDialogOpen] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await getUserList();
        // Traitez les données des utilisateurs si nécessaire
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer la liste des utilisateurs.",
          variant: 'destructive',
        });
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (password && currentUser) {
        await updatePassword(currentUser, password);
        toast({
          title: "✅ Mot de passe mis à jour !",
          description: "Votre mot de passe a été mis à jour avec succès.",
        });
      } else if (password) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour changer le mot de passe.",
          variant: 'destructive',
        });
      }

      const updatedUser = { ...user, firstName, lastName, direction, email, ip, location };

      const db = getFirestore();
      const userDoc = doc(db, "admins", user.id);
      await updateDoc(userDoc, updatedUser);

      toast({
        title: "✅ Données utilisateur mises à jour avec succès !",
        description: "Les informations de l'utilisateur ont été mises à jour dans Firestore.",
      });

      onSave(updatedUser);

      // Fermer le dialogue après la sauvegarde
      setDialogOpen(false);

    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour. Veuillez réessayer.",
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
          <Button type="button" onClick={handleSave}>
            Sauvegarder
          </Button>
          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
