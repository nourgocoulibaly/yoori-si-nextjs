"use client"


import {
  Bird,
  CornerDownLeft,
  Mic,
  Paperclip,
  Rabbit,
  Turtle,
} from "lucide-react";

import { TooltipProvider } from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useChat } from 'ai/react';

import MessageBubble from './MessageBubble'; // Importer le nouveau composant

export default function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
   api: '/api/chat'
 })
  const [adminName, setAdminName] = useState("");
  const [userMessage, setUserMessage] = useState(""); // État pour le message de l'utilisateur
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]); // État pour l'historique des messages
  const [userId, setUserId] = useState<string | null>(null); // Ajouter l'état pour userId

  useEffect(() => {
    const fetchUserId = async () => {
      const auth = getAuth();
      const db = getFirestore();

      try {
        const user = auth.currentUser;
        if (user) {
          setUserId(user.uid); // Récupérer l'ID de l'utilisateur
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'ID de l'utilisateur:", error);
      }
    };

    fetchUserId();
  }, []);

  // const handleSendMessage = async () => {
  //   if (!userMessage.trim()) return; // Ne rien faire si le message est vide

  //   try {
  //       const assistantMessage = await sendMessageToOpenAI(userMessage); 
  //       // Vérifiez que le message n'est pas déjà dans l'historique
  //       setChatHistory(prev => {
  //           const newMessages = [{ role: "user", content: userMessage }, { role: "assistant", content: assistantMessage }];
  //           // Ajoutez uniquement si le dernier message n'est pas le même
  //           if (prev.length === 0 || prev[prev.length - 1].content !== userMessage) {
  //               return [...prev, ...newMessages];
  //           }
  //           return prev; // Ne rien ajouter si le dernier message est le même
  //       });
  //       setUserMessage(""); // Réinitialiser le champ de message
  //   } catch (error) {
  //       console.error("Erreur lors de l'envoi du message:", error);
  //   }
  // };

  useEffect(() => {
    const fetchAdminName = async () => {
      const auth = getAuth();
      const db = getFirestore();

      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "admins", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setAdminName(`${userData.firstName} ${userData.lastName}`);
          } else {
            console.log("Aucun document trouvé pour cet utilisateur");
            setAdminName("Admin");
          }
        } else {
          console.log("Aucun utilisateur connecté");
          setAdminName("Admin");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du nom de l'admin:", error);
        setAdminName("Admin");
      }
    };

    fetchAdminName();
  }, []);

  return (
    <div className="grid w-full py-6 ">
      <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="relative hidden flex-col items-start rounded-lg px-2 py-5 gap-8 md:flex bg-background" x-chunk="dashboard-03-chunk-0"
          >
            <form className="grid w-full items-start gap-6" >
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Paramètres
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="model">Modèle</Label>
                  <Select>
                    <SelectTrigger
                      id="model"
                      className="items-start [&_[data-description]]:hidden"
                    >
                      <SelectValue placeholder="Selectionner un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genesis">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Rabbit className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                            Modèle{" "}
                              <span className="font-medium text-foreground">
                                Genesis
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Le modèle le plus rapide pour les cas d&apos;utilisation généraux.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="explorer">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Bird className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Modèle{" "}
                              <span className="font-medium text-foreground">
                                Explorateur
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Performance et vitesse pour l&apos;efficacité.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="quantum">
                        <div className="flex items-start gap-3 text-muted-foreground">
                          <Turtle className="size-5" />
                          <div className="grid gap-0.5">
                            <p>
                              Modèle{" "}
                              <span className="font-medium text-foreground">
                                Quantique
                              </span>
                            </p>
                            <p className="text-xs" data-description>
                              Le modèle le plus puissant pour les calculs complexes.
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="temperature">Température</Label>
                  <Input id="temperature" type="number" placeholder="0.4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="top-p">Top P</Label>
                    <Input id="top-p" type="number" placeholder="0.7" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="top-k">Top K</Label>
                    <Input id="top-k" type="number" placeholder="0.0" />
                  </div>
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Messages
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="role">Rôle</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">Système</SelectItem>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="content">Contenu (Guide)</Label>
                  <Textarea
                    id="content"
                    placeholder="Vous êtes un..."
                    className="min-h-[9.5rem]"
                  />
                </div>
              </fieldset>
            </form>
          </div>
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-sky-950 p-4 lg:col-span-2 overflow-hidden">
            <Badge variant="outline" className="absolute right-3 top-3">
              Sortie
            </Badge>
            <div className="flex flex-col h-full overflow-auto">
              <div className="flex flex-col h-full">
                <div className="flex justify-start mb-4">
                  <div className="p-2 mt-4 max-w-sm bg-white rounded-xl shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="shrink-0">
                        <img className="w-9 h-9" src="/bot.png" alt="Logo ChitChat" />
                      </div>
                      <div>
                        <div className="text-md font-bold text-black">Yoori Bot</div>
                        <p className="text-sm text-slate-500">
                          Bonjour {adminName}. Que puis-je faire pour vous ?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {messages
                  .filter(m => m.role === 'user' || m.role === 'assistant')
                  .map((m, index) => (
                    <MessageBubble 
                      key={index}
                      role={m.role as 'user' | 'assistant'} 
                      content={m.content} // Suppression du préfixe
                    />
                ))}


              </div>
              <form
                className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1" x-chunk="dashboard-03-chunk-1"
                onSubmit={handleSubmit} // Gérer l'envoi du message
              >
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={input} 
                  onChange={handleInputChange}
                  placeholder="Entrez votre message ici..."
                  className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                <div className="flex items-center p-3 pt-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                  <Paperclip className="size-4" />
                                  <span className="sr-only">Attacher un fichier</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>🤖 Désolé vous n&apos;avez pas accès à cette fonctionnalité ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette fonctionnalité est réservée aux utilisateurs Premium.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Fermer</AlertDialogCancel>
                                <AlertDialogAction>
                                  Continuer
                                  </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </TooltipTrigger>
                      <TooltipContent side="top">Attacher un fichier</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Mic className="size-4" />
                              <span className="sr-only">Utiliser le microphone</span>
                            </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>🤖 Désolé vous n&apos;avez pas accès à cette fonctionnalité ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette fonctionnalité est réservée aux utilisateurs Premium.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Fermer</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </TooltipTrigger>
                      <TooltipContent side="top">Utiliser le microphone</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                    <Button type="submit" size="sm" className="ml-auto gap-1.5">
                      Envoyer
                      <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
    </div>
)
}