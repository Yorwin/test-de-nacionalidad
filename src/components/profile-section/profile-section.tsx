"use client"

import React, { useState, useEffect } from "react"
import styles from "@/styles/components/profile-section.module.scss"
import Link from "next/link";
import Image from "next/image";

/* Firestore */
import { signOut, onAuthStateChanged, User, signInAnonymously } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase';
import { doc, getDoc, setDoc, DocumentData } from 'firebase/firestore';

/* No Profile Img */
import ProfileDefaultImage from "@/resources/profile-default.png";

/* Loading Component */
import ProfileSectionSkeletonLoader from "./profile-section-skeleton-loader";

const ProfileSection = () => {

    const [isButtonPressed, setIsButtonPressed] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

            if (!currentUser) {

                // 🔹 Si no ya hay usuario, accedemos con usuario anonimo. 
                try {
                    const result = await signInAnonymously(auth);
                    setUser(result.user);

                    // 🔹 Si ya hay usuario, cargamos sus datos
                    await setDoc(doc(db, "users", result.user.uid), {
                        isAnonymous: true,
                        username: `Guest User ${result.user.uid.slice(-4)}`,
                        displayEmail: "Invitado temporal",
                        createdAt: new Date(),
                    });
                } catch (error) {
                    console.error("Error creando usuario invitado:", error);
                }
            } else {
                setUser(currentUser);

                // 🔹 Si ya hay usuario, cargamos sus datos
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
                } finally {
                    setLoading(false);
                }
            }
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return (
            <ProfileSectionSkeletonLoader />
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
                {userData?.isAnonymous ? null :
                    <li>
                        <div className={styles["link-container"]}>
                            <Link className={styles["menu-link"]} href="/perfil">
                                <i className="bi bi-person"></i>
                                <small>Perfil</small>
                            </Link>
                        </div>
                    </li>
                }
                <li>
                    {userData &&
                        <div className={styles["link-container"]}>
                            <Link className={styles["menu-link"]} href="/ajustes">
                                <i className="bi bi-gear"></i>
                                <small>Configuraciones</small>
                            </Link>
                        </div>}
                </li>
                <li>
                    {userData?.isAnonymous ? <div className={styles["log-in-register-container"]}>
                        <Link className={styles["menu-link"]} href="/autorizacion/iniciar-sesion">
                            <i className="bi bi-box-arrow-in-right"></i>
                            <small>Iniciar sesión</small>
                        </Link>
                        <Link className={styles["menu-link"]} href="/autorizacion/registrarse">
                            <i className="bi bi-pencil-square"></i>
                            <small>Registrarse</small>
                        </Link>
                    </div>
                        : (
                            <button onClick={logoutUser} className={styles["button-menu"]}>
                                <i className="bi bi-box-arrow-right"></i>
                                <small>Cerrar sesión</small>
                            </button>
                        )
                    }
                </li>
            </ul>
        </div>
    );


    const toggleMenu = () => {
        setIsButtonPressed(!isButtonPressed);
    };

    return (
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
                    <li className={styles["e-mail"]}>{userData?.isAnonymous ? userData?.displayEmail : userData?.email}</li>
                </ul>
            </div>
            <button
                onClick={toggleMenu}
                className={`${styles["menu-button"]}`}
            >
                <i className="bi bi-chevron-down"></i>
            </button>
            {isButtonPressed && menuBar}
        </div>
    )
};

export default ProfileSection;