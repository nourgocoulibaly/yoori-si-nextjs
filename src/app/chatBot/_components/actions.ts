import { createStreamableValue } from "ai/rsc"; // Assurez-vous d'importer correctement

export const generate = async (input: string) => {
	// Remplacez cette URL par celle de votre API
	const response = await fetch("/api/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ input }), // Envoyer l'input à l'API
	});

	if (!response.ok) {
		throw new Error("Erreur lors de la génération");
	}

	const output = await response.json();
	return createStreamableValue(output); // Retourner le résultat sous forme de valeur streamable
};
