"use client";

import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	UserCredential
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
	pseudo: string;
	firstName: string;
	lastName: string;
	direction: string;
	localisationTour: string;
	localisationEtagePorte: string;
	phoneNumber: string; // Added phoneNumber field
}

interface AuthContextType {
	currentUser: User | null;
	isAdmin: boolean;
	userRole: string | null;
	setUserRole: (role: string) => Promise<void>;

	signup: (
		email: string,
		password: string,
		pseudo: string,
		passwordConfirm: string,
		firstName: string,
		lastName: string,
		direction: string,
		localisationTour: string,
		localisationEtagePorte: string,
		phoneNumber: string // Added phoneNumber parameter
	) => Promise<UserCredential>;
	login: (email: string, password: string, pseudo?: string) => Promise<UserCredential>;
	logout: () => Promise<void>;
	userId: string | null;
}

const AuthContext = createContext<AuthContextType>({
	currentUser: null,
	isAdmin: false,
	userRole: null,
	setUserRole: async () => {
		throw new Error("setUserRole non implémenté");
	},
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
	const [userRole, setUserRoleState] = useState<string | null>(null);

	const setUserRole = async (role: string) => {
		setUserRoleState(role);
		localStorage.setItem('userRole', role);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				const userDoc = await getUserByEmail(firebaseUser.email!);
				const user: User = {
					uid: firebaseUser.uid,
					email: firebaseUser.email!,
					pseudo: userDoc?.pseudo ?? "",
					firstName: userDoc?.firstName ?? "",
					lastName: userDoc?.lastName ?? "",
					direction: userDoc?.direction ?? "",
					localisationTour: userDoc?.localisationTour ?? "",
					localisationEtagePorte: userDoc?.localisationEtagePorte ?? "",
					phoneNumber: userDoc?.phoneNumber ?? "" // Added phoneNumber field
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
		pseudo: string,
		firstName: string,
		lastName: string,
		direction: string,
		localisationTour: string,
		localisationEtagePorte: string,
		phoneNumber: string // Added phoneNumber parameter
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
				pseudo,
				firstName,
				lastName,
				email,
				direction,
				localisationTour,
				localisationEtagePorte,
				phoneNumber // Added phoneNumber field
			});
			return credential;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const login = async (
		email: string,
		password: string,
		pseudo?: string
	): Promise<UserCredential> => {
		try {
			const credential = await signInWithEmailAndPassword(auth, email, password);
			
			// Si un pseudo est fourni, mettons à jour le document utilisateur
			if (pseudo) {
				await setDoc(doc(db, "users", credential.user.uid), { pseudo }, { merge: true });
			}
			
			return credential;
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const logout = async (): Promise<void> => {
		try {
			await signOut(auth);
			setUserRoleState(null);
			localStorage.removeItem('userRole');
			setCurrentUser(null);
			setUserId(null);
		} catch (error: any) {
			throw new Error(error.message);
		}
	};

	const value = {
		currentUser,
		isAdmin: false,
		userRole: userRole,
		setUserRole,
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