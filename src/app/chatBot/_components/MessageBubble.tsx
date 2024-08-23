"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";


interface MessageBubbleProps {
  role: 'user' | 'assistant' | string; // Accepte tout type de rôle
  content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("");


  const handleDelete = (content: string) => {
    console.log(`Message supprimé: ${content}`);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault(); // Empêche l'ouverture du menu contextuel par défaut
  };

  if (role !== 'user' && role !== 'assistant') return null;

  const renderContent = (content: string) => {
    // Remplacer les sauts de ligne par des balises <br />
    const lines = content.split("\n").map((line, index) => {
      // Gérer le texte en gras et en italique
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"); // Gras
      line = line.replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italique
      line = line.replace(/`(.*?)`/g, "<code className='bg-gray-200 p-1 rounded'>$1</code>"); // Code
      line = line.replace(/\n/g, "<br />"); // Ajout de saut de ligne
      return <p key={index} className="text-sm text-slate-500" dangerouslySetInnerHTML={{ __html: line }} />; // Utilisation de dangerouslySetInnerHTML
    });

    // Gérer les tableaux
    if (content.startsWith("|")) {
      const rows = content.split("\n").map(row => row.split("|").slice(1, -1));
      return (
        <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              {rows[0].map((header, index) => (
                <th key={index} className="border border-gray-300 p-2 text-left font-semibold">{header.trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 p-2">{cell.trim()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return lines; // Retourner les lignes avec les sauts de ligne
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={`flex ${role === "assistant" ? "justify-start" : "justify-end"} mb-4`}
    >
      <div
        className={`p-2 mt-4 max-w-sm rounded-xl shadow-lg ${
          role === "assistant" ? "bg-white" : "bg-blue-100"
        }`}
      >
        <div className="max-h-60 overflow-y-auto"> {/* Ajout d'un conteneur avec défilement pour la boîte de dialogue */}
          {role === "assistant" ? (
            <div className="flex items-start space-x-4"> {/* Changement de items-center à items-start pour aligner l'image en haut */}
              <div className="shrink-0">
                <img className="w-9 h-9" src="/bot.png" alt="Logo ChitChat" />
              </div>
              <div>
                <div className="text-md font-bold text-black">Yoori Bot</div>
                {renderContent(content)} {/* Utilisation de renderContent pour afficher le contenu */}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-black text-right">{content}</div>
            </div>
          )}
        </div>
      </div>

      {role === "user" && (
        <DropdownMenu onOpenChange={(open: boolean) => {
          if (!open) setSelectedUser(null);
        }}>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="true"
              size="icon"
              variant="ghost"
              onContextMenu={(e) => e.preventDefault()}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSelectedUser(content)}>Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(content)}>Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default MessageBubble;