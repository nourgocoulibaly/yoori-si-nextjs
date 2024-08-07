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
import { getAuth, updatePassword } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore"; // Importer les fonctions nécessaires
import { useEffect, useState } from 'react';
import { getAdminList } from '../api/utils'; // Mise à jour du chemin d'accès

import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  direction: string;
  email: string;
  ip?: string;
  location?: string;
  password?: string; // Ajout de cette ligne
}

export function DataModif({ user, onSave }: { user: User; onSave: (user: User) => void }) {
  const [userData, setUserData] = useState({ ...user });
  const [userList, setUserList] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(true);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const admins = await getAdminList();
      const completeAdmins = admins.map((user: any) => ({
        ...user,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        direction: user.direction || '',
        email: user.email || '',
        ip: user.ip || '',
        location: user.location || ''
      }));
      setUserList(completeAdmins);
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Utilisateur non connecté");
      }

      const db = getFirestore();
      const userDoc = doc(db, "admins", user.id);
      
      // Mise à jour des données utilisateur sans le mot de passe
      await updateDoc(userDoc, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        direction: userData.direction,
        email: userData.email,
        ip: userData.ip,
        location: userData.location
      });

      if (userData.password) {
        try {
          await updatePassword(currentUser, userData.password);
          toast({
            title: "✅ Mot de passe mis à jour !",
            description: "Votre mot de passe a été mis à jour avec succès.",
          });
        } catch (passwordError) {
          console.error("Erreur lors de la mise à jour du mot de passe:", passwordError);
          toast({
            title: "Erreur",
            description: "Impossible de mettre à jour le mot de passe. Veuillez réessayer plus tard.",
            variant: 'destructive',
          });
          return;
        }
      }

      toast({
        title: "✅ Données utilisateur mises à jour avec succès !",
        description: "Les informations de l'utilisateur ont été mises à jour.",
      });

      onSave(userData);

      const admins = await getAdminList();
      const completeAdmins = admins.map((user: any) => ({
        ...user,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        direction: user.direction || '',
        email: user.email || '',
        ip: user.ip || '',
        location: user.location || ''
      }));
      setUserList(completeAdmins);

      setDialogOpen(false);
    } catch (error: unknown) {
      console.error("Erreur détaillée lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de la mise à jour : ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <Input id="firstName" value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Nom
            </Label>
            <Input id="lastName" value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="direction" className="text-right">
              Direction
            </Label>
            <Input id="direction" value={userData.direction} onChange={(e) => setUserData({ ...userData, direction: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ip" className="text-right">
              IP
            </Label>
            <Input id="ip" value={userData.ip || ''} onChange={(e) => setUserData({ ...userData, ip: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Localisation
            </Label>
            <Input id="location" value={userData.location || ''} onChange={(e) => setUserData({ ...userData, location: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Mot de passe
            </Label>
            <Input id="password" type="password" value={userData.password || ''} onChange={(e) => setUserData({ ...userData, password: e.target.value })} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isLoading}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}