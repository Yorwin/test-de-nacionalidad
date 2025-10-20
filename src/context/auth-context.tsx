import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, DocumentData } from "firebase/firestore";

interface AuthContextType {
    user: User | null;
    userData: DocumentData | null;
    loading: boolean;
}

type AuthProviderProps = {
    children: React.ReactNode
};

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true });

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Fetch user data from Firestore when user is authenticated
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        console.log("No user data found in Firestore");
                        setUserData(null);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, userData, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider')
    }

    return context;
};
