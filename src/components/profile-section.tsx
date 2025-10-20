"use client"

import React, { useState, useEffect } from "react"
import styles from "@/styles/components/profile-section.module.scss"
import Link from "next/link";
import Image from "next/image";

/* Firestore */
import { signOut, onAuthStateChanged, User } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase';
import { doc, getDoc, DocumentData } from 'firebase/firestore';

/* No Profile Img */
import ProfileDefaultImage from "@/resources/profile-default.png";


const ProfileSection = () => {

    const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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

    if (loading) {
        return (
            <h3>Loading...</h3>
        );
    }

    const logoutUser = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log("Error al cerrar sesión", error);
        }
    }

    const menuBar = (
        <div className={`${styles["menu-bar"]} ${styles["menu-bar-absolute"]}`}>
            <ul>
                <li>
                    {userData !== null &&
                        <div className={styles["container-enlace"]}>
                            <Link className={styles["enlace-menu"]} href="/perfil">
                                <i className="bi bi-person"></i>
                                Perfil
                            </Link>
                        </div>}
                </li>
                <li>
                    {userData !== null &&
                        <div className={styles["container-enlace"]}>
                            <Link className={styles["enlace-menu"]} href="/ajustes">
                                <i className="bi bi-person"></i>
                                Configuraciones
                            </Link>
                        </div>}
                </li>
                <li onClick={logoutUser}>
                    {userData !== null && <>

                        <button onClick={logoutUser} className={styles["button-menu"]}>
                            <i className="bi bi-box-arrow-right"></i>
                            <small>Cerrar sesión</small>
                        </button>
                    </>
                    }
                </li>
            </ul>
        </div>
    );


    const toggleMenu = () => {
        setIsButtonPressed(!isButtonPressed);
    };

    return user ? (
        <div className={styles["main-container"]}>
            <div className={styles["profile"]}>
                <div className={styles["profile-info-container"]}>
                    <div className={styles["profie-image-container"]}>
                        <Image
                            src={ProfileDefaultImage}
                            alt="Imagen por defecto perfil"
                            className={styles["profile-image"]}
                            fill
                        />
                    </div>
                    <div className={styles["profile-info-section"]}>
                        <ul>
                            <li className={styles["username"]}>{userData?.username}</li>
                            <li className={styles["e-mail"]}>{userData?.email}</li>
                        </ul>
                    </div>
                    <button
                        onClick={toggleMenu}
                        className={`${styles["menu-button"]} ${isButtonPressed ? styles["rotated"] : ''}`}
                    >
                        <i className="bi bi-chevron-down"></i>
                    </button>
                </div>
                {isButtonPressed && menuBar}
            </div>
        </div>
    ) : <h3>No hay información</h3>
};

export default ProfileSection;