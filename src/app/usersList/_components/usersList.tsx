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

import { collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { DataModif } from "./dataModif"
import { AddUserDialog } from "./userAdd"; // Importer le composant AddUserDialog

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
  location?: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const db = getFirestore();

  const handleDelete = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => {
          const data = doc.data() as User;
          return {
            id: doc.id,
            firstName: data.firstName,
            lastName: data.lastName,
            direction: data.direction,
            email: data.email,
            ip: data.ip,
            location: data.location
          };
        }).sort((a, b) => {
          if (a.direction < b.direction) return -1;
          if (a.direction > b.direction) return 1;
          if ((a.location || '') < (b.location || '')) return -1;
          if ((a.location || '') > (b.location || '')) return 1;
          if ((a.ip || '') < (b.ip || '')) return -1;
          if ((a.ip || '') > (b.ip || '')) return 1;
          return 0;
        });
        setUsers(usersData);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, [db]);

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
  }, [users, db]);

  return (
    <div className='flex min-h-screen w-full flex-col bg-muted/40 '>
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
          <CardDescription>
            Gérez vos utilisateurs et consultez leurs détails.        
          </CardDescription>
          <div className='ml-auto flex items-center gap-2 justify-end'>
            
            {isAddUserDialogOpen && (
              <AddUserDialog
                onSave={(newUser) => {
                  setUsers([...users, newUser]);
                  setIsAddUserDialogOpen(false);
                }}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom & Prénoms</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Adresse IP</TableHead>
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
                        <DropdownMenuItem onClick={() => setSelectedUser(user)}>Modifier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(user.id)}>Supprimer</DropdownMenuItem>
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
            Affichage d&apos;Un Total de <strong>{users.length}</strong> Utilisateurs.
          </div>
        </CardFooter>
      </Card>
      {selectedUser && (
        <DataModif
          user={selectedUser}
          onSave={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  )
}