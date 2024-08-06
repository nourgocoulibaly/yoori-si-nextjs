"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
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

const promptForCredentials = (currentUser: any) => {
  const password = prompt("Veuillez entrer votre mot de passe actuel pour confirmer:");
  return EmailAuthProvider.credential(currentUser.email!, password!);
};

export function DataModif({ user, onSave }: { user: User; onSave: (user: User) => void }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [direction, setDirection] = useState(user.direction);
  const [email, setEmail] = useState(user.email);
  const [ip, setIp] = useState(user.ip || '');
  const [location, setLocation] = useState(user.location || '');
  const [password, setPassword] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(true);
  const { toast } = useToast();
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
=======
>>>>>>> ab4cd32c84e95ebeed6dd5e34f006e3637015cfb

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
<<<<<<< HEAD
    setIsLoading(true);
=======
>>>>>>> ab4cd32c84e95ebeed6dd5e34f006e3637015cfb
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

<<<<<<< HEAD
=======
      if (password && currentUser) {
        // Mise à jour du mot de passe de l'utilisateur
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

>>>>>>> ab4cd32c84e95ebeed6dd5e34f006e3637015cfb
      // Mise à jour des informations de l'utilisateur dans Firestore
      const updatedUser = { ...user, firstName, lastName, direction, email, ip, location };

      const db = getFirestore();
<<<<<<< HEAD
      const userDoc = doc(db, "users", user.id);
      await updateDoc(userDoc, updatedUser);

      // Mise à jour du mot de passe si nécessaire
      if (password) {
        if (currentUser) {
          // Réauthentifier l'utilisateur avant de changer le mot de passe
          const credential = promptForCredentials(currentUser);
          await reauthenticateWithCredential(currentUser, credential);
          
          await updatePassword(currentUser, password);
          toast({
            title: "✅ Mot de passe mis à jour !",
            description: "Votre mot de passe a été mis à jour avec succès.",
          });
        } else {
          throw new Error("Utilisateur non connecté");
        }
      }

      toast({
        title: "✅ Données utilisateur mises à jour avec succès !",
        description: "Les informations de l'utilisateur ont été mises à jour.",
=======
      const userDoc = doc(db, "admins", user.id);
      await updateDoc(userDoc, updatedUser);

      toast({
        title: "✅ Données utilisateur mises à jour avec succès !",
        description: "Les informations de l'utilisateur ont été mises à jour dans Firestore.",
>>>>>>> ab4cd32c84e95ebeed6dd5e34f006e3637015cfb
      });

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

<<<<<<< HEAD
      setDialogOpen(false);
=======
>>>>>>> ab4cd32c84e95ebeed6dd5e34f006e3637015cfb
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour. Veuillez réessayer.",
        variant: 'destructive',
      });
<<<<<<< HEAD
    } finally {
      setIsLoading(false);
=======
>>>>>>> ab4cd32c84e95ebeed6dd5e34f006e3637015cfb
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
<<<<<<< HEAD
      {/* <DialogTrigger asChild>
=======
      <DialogTrigger asChild>
>>>>>>> ab4cd32c84e95ebeed6dd5e34f006e3637015cfb
        <Button variant="outline">Modifier le profil</Button>
      </DialogTrigger> */}
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
<<<<<<< HEAD
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isLoading}>
=======
          <Button type="button" onClick={handleSave}>
            Sauvegarder
          </Button>
          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
>>>>>>> ab4cd32c84e95ebeed6dd5e34f006e3637015cfb
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> ab4cd32c84e95ebeed6dd5e34f006e3637015cfb
