"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signInAnonymously } from "firebase/auth";
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc, setDoc, DocumentData } from "firebase/firestore";

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
            if (currentUser) {
                setUser(currentUser);

                // Fetch or create user data from Firestore
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    } else {
                        if (currentUser.isAnonymous) {
                            // Create data for anonymous user
                            const guestData = {
                                uid: currentUser.uid,
                                isAnonymous: true,
                                username: `Guest User ${currentUser.uid.slice(-4)}`,
                                displayEmail: "Invitado temporal",
                                createdAt: new Date(),
                            };
                            await setDoc(userRef, guestData);
                            setUserData(guestData);
                        } else {
                            console.log("No user data found in Firestore for authenticated user");
                            setUserData(null);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching/creating user data:", error);
                    setUserData(null);
                }
            } else {
                // No user authenticated, sign in anonymously
                try {
                    await signInAnonymously(auth);
                    // The callback will be triggered again with the new user
                } catch (error) {
                    console.error("Error signing in anonymously:", error);
                }
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
