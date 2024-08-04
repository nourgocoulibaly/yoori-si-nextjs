"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"


async function getUserIP() {
  const res = await fetch('https://api.ipify.org?format=json');
  const data = await res.json();
  return data.ip;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  direction: string;
  email: string;
  ip?: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const db = getFirestore(); // Added this line to initialize 'db'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => {
          const data = doc.data() as User; // Cast data to User type
          console.log("Données de l'utilisateur :", data);
          return {
            id: doc.id,
            firstName: data.firstName,
            lastName: data.lastName,
            direction: data.direction,
            email: data.email,
            ip: data.ip
          };
        });
        setUsers(usersData);
        console.log("Toutes les données des utilisateurs :", usersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, [db]); // Ajout de 'db' comme dépendance

  useEffect(() => {
    const updateUserIP = async () => {
      const ip = await getUserIP();
      users.forEach(async (user) => {
        if (!user.ip) {
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, { ip });
        }
      });
    };

    if (users.length > 0) {
      updateUserIP();
    }
  }, [users, db]); // Ajout de 'db' comme dépendance manquante

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs</CardTitle>
        <CardDescription>
          Gérez vos utilisateurs et consultez leurs détails.        
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom & Prenoms</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Addresse IP</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.direction}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.email}</Badge>
                </TableCell>
                <TableCell>{user.ip || "N/A"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Affichage de <strong>{users.length}</strong> Utilisateurs.
        </div>
      </CardFooter>
    </Card>
  )
}
