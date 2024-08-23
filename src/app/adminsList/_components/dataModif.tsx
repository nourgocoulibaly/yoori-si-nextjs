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
import { fetchSignInMethodsForEmail, getAuth, updatePassword } from "firebase/auth";
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
  pseudo: string; // Ajout du champ pseudo
  phoneNumber: string | null; // Modifié pour accepter null
}

export function DataModif({ user, onSave }: { user: User; onSave: (user: User) => void }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [direction, setDirection] = useState(user.direction);
  const [email, setEmail] = useState(user.email);
  const [ip, setIp] = useState(user.ip || '');
  const [localisationTour, setLocalisationTour] = useState(user.location?.split(',')[0] || '');
  const [localisationEtagePorte, setLocalisationEtagePorte] = useState(user.location?.split(',')[1] || '');
  const [pseudo, setPseudo] = useState(user.pseudo || ''); // Nouvel état pour le pseudo
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || ''); // Modifié pour utiliser '' comme valeur par défaut
  const [userList, setUserList] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(true);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const defaultPassword = "DMISSA@2024"; // Définissez le mot de passe par défaut ici

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // L'utilisateur est connecté, vous pouvez charger les données
        const admins = await getUserList();
        const completeUsers = admins.map((user: any) => ({
          ...user,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          direction: user.direction || '',
          email: user.email || '',
          ip: user.ip || '',
          localisationTour: user.localisationTour || '',
          localisationEtagePorte: user.localisationEtagePorte || '',
          pseudo: user.pseudo || '' // Ajout du pseudo
        }));
        setUserList(completeUsers);
      } else {
        // L'utilisateur n'est pas connecté, gérez cette situation
        console.log("Utilisateur non connecté");
        // Rediriger vers la page de connexion ou afficher un message
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Utilisateur non connecté");
      }

      const updatedFields: Partial<User> = {};

      // Vérifier chaque champ et ne l'ajouter que s'il a été modifié
      if (firstName !== user.firstName) updatedFields.firstName = firstName;
      if (lastName !== user.lastName) updatedFields.lastName = lastName;
      if (direction !== user.direction) updatedFields.direction = direction;
      if (email !== user.email) updatedFields.email = email;
      if (ip !== user.ip) updatedFields.ip = ip;
      if (localisationTour !== user.location?.split(',')[0] || localisationEtagePorte !== user.location?.split(',')[1]) {
        updatedFields.location = `${localisationTour},${localisationEtagePorte}`;
      }
      if (pseudo !== user.pseudo) updatedFields.pseudo = pseudo;
      if (phoneNumber !== user.phoneNumber) {
        updatedFields.phoneNumber = phoneNumber || null; // Utiliser null si la chaîne est vide
      }

      // Ne mettre à jour que si des champs ont été modifiés
      if (Object.keys(updatedFields).length > 0) {
        const db = getFirestore();
        const userDoc = doc(db, "admins", user.id);
        await updateDoc(userDoc, updatedFields);

        toast({
          title: "✅ Données utilisateur mises à jour avec succès !",
          description: "Les informations de l'utilisateur ont été mises à jour.",
        });

        // Mettre à jour l'objet user avec les nouvelles valeurs
        const updatedUser = { ...user, ...updatedFields };
        onSave(updatedUser);

        // Mettre à jour la liste des utilisateurs après la sauvegarde
        const admins = await getUserList();
        setUserList(admins.map((u: any) => ({
          ...u,
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          direction: u.direction || '',
          email: u.email || '',
          ip: u.ip || '',
          location: u.location || '',
          pseudo: u.pseudo || '',
          phoneNumber: u.phoneNumber || ''
        })));

        setDialogOpen(false);
      } else {
        toast({
          title: "Aucune modification",
          description: "Aucune modification n'a été détectée.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour. Veuillez réessayer.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    setIsResetting(true);
    try {
      const auth = getAuth();
      const db = getFirestore();

      // Vérifier si l'utilisateur existe avec l'adresse e-mail
      const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);
      if (!signInMethods || signInMethods.length === 0) {
        throw new Error("Utilisateur non trouvé");
      }

      // Obtenir l'utilisateur actuel
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Utilisateur non connecté");
      }

      // Mettre à jour le mot de passe dans Firebase Auth
      await updatePassword(currentUser, defaultPassword);

      // Mettre à jour le document de l'utilisateur dans Firestore
      const userDoc = doc(db, "admins", user.id);
      await updateDoc(userDoc, { passwordReset: true });

      toast({
        title: "✅ Réinitialisation du mot de passe",
        description: `Le mot de passe de l'utilisateur a été réinitialisé à "${defaultPassword}".`,
      });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      toast({
        title: "⚠️ Erreur de réinitialisation du mot de passe",
        description: "Une erreur est survenue lors de la réinitialisation du mot de passe.",
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
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
            <Label htmlFor="localisationTour" className="text-right">
              Localisation (Tour)
            </Label>
            <Input id="localisationTour" value={localisationTour} onChange={(e) => setLocalisationTour(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="localisationEtagePorte" className="text-right">
              Localisation (Etage/Porte)
            </Label>
            <Input id="localisationEtagePorte" value={localisationEtagePorte} onChange={(e) => setLocalisationEtagePorte(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pseudo" className="text-right">
              Pseudo
            </Label>
            <Input id="pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Numéro de téléphone
            </Label>
            <Input 
              id="phoneNumber" 
              type="text" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resetPassword" className="text-right">
              Réinitialiser le mot de passe
            </Label>
            <Button id="resetPassword" onClick={handleResetPassword} className="col-span-3" disabled={isResetting}>
              {isResetting ? "Réinitialisation..." : "Réinitialiser"}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Sauvegarde en cours..." : "Sauvegarder"}
          </Button>
          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting || isResetting}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}