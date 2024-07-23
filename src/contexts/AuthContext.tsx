"use client";

import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut, // Renommer User en FirebaseUser
	UserCredential,
} from "firebase/auth";

import { auth, db } from "@/lib/firebaseConfig";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import {
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";

interface User {
	uid: string;
	email: string;
	firstName: string; // Prénom de l'utilisateur
	lastName: string; // Nom de famille de l'utilisateur
	direction: string; // Direction/Service de l'utilisateur
}

interface AuthContextType {
	currentUser: User | null;
	isAdmin: boolean; // Added isAdmin property

	signup: (
		email: string,
		password: string,
		passwordConfirm: string,
		firstName: string,
		lastName: string,
		direction: string
	) => Promise<UserCredential>;
	login: (email: string, password: string) => Promise<UserCredential>;
	logout: () => Promise<void>;
	userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	isAdmin: false,
	signup: async () => {
		throw new Error("signup non implémenté");
	},
	login: async () => {
		throw new Error("login non implémenté");
	},
	logout: async () => {
		throw new Error("logout non implémenté");
	},
	userId: null,
});

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth doit être utilisé dans un AuthProvider");
	}
	return context;
}

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				const userDoc = await getUserByEmail(firebaseUser.email!);
				const user: User = {
					uid: firebaseUser.uid,
					email: firebaseUser.email!,
					firstName: userDoc ? userDoc.firstName : "", // Utilisez une valeur par défaut si non trouvé
					lastName: userDoc ? userDoc.lastName : "", // Utilisez une valeur par défaut si non trouvé
					direction: userDoc ? userDoc.direction : "", // Utilisez une valeur par défaut si non trouvé
				};
				setCurrentUser(user);
			} else {
				setCurrentUser(null);
			}
			setLoading(false);
			if (firebaseUser) {
				setUserId(firebaseUser.uid);
			} else {
				setUserId(null);
			}
		});

		return unsubscribe;
	}, []);

	async function getUserByEmail(email: string): Promise<User | null> {
		const usersRef = collection(db, "users");
		const querySnapshot = await getDocs(
			query(usersRef, where("email", "==", email))
		);
		return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as User);
	}

	const signup = async (
		email: string,
		password: string,
		passwordConfirm: string,
		firstName: string,
		lastName: string,
		direction: string
	): Promise<UserCredential> => {
		if (password !== passwordConfirm) {
			throw new Error("Les mots de passe ne correspondent pas");
		}
		if (password.length < 6) {
			throw new Error("Le mot de passe doit contenir au moins 6 caractères");
		}

		try {
			const existingUser = await getUserByEmail(email);
			if (existingUser) {
				throw new Error("Email déjà utilisé");
			}

			const credential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			await setDoc(doc(db, "users", credential.user.uid), {
				firstName,
				lastName,
				email,
			});
			return credential;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const login = async (
		email: string,
		password: string
	): Promise<UserCredential> => {
		try {
			return await signInWithEmailAndPassword(auth, email, password);
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const logout = async (): Promise<void> => {
		try {
			await signOut(auth);
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const value = {
		currentUser,
		isAdmin: false, // Ajoutez cette ligne pour inclure la propriété isAdmin
		signup,
		login,
		logout,
		userId,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
