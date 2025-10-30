"use client"

import React, { useEffect, useState } from "react";
import ArrowGoBack from "../../components/arrow-go-back";
import { useRouter } from "next/navigation";
import { db, auth } from "@/firebase/firebase";
import styles from "@/styles/layout/settings/settings.module.scss"
import RecoverPasswordEmailSent from "@/components/pages/settings/recover-password-email-sent";
import ChangeEmail from "@/components/pages/settings/change-email";
import { sendPasswordResetEmail, onAuthStateChanged, User, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, DocumentData } from 'firebase/firestore';

const Settings = () => {

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

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    /* Password Recovery Logic */

    const [passwordChangeMessage, setPasswordChangeMessage] = useState(false);

    const toggleConfirmationPasswordMesage = () => {
        if (!passwordChangeMessage) {
            handleResetPassword();
        }

        setPasswordChangeMessage(e => !e);
    }

    const [submit, setSubmit] = useState(false);

    const handleResetPassword = async () => {
        setSubmit(true);

        const user = auth.currentUser;
        const emailRecover = user?.email;

        if (!emailRecover) {
            setSubmit(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, emailRecover);
            setSubmit(false);
            setPasswordChangeMessage(true); // Mostrar el mensaje de confirmación
        } catch (error) {
            setSubmit(false);
            console.error("Se ha producido un error" + error)
        }
    };

    /* Email Recovery Logic */

    const [updateEmail, setUpdateEmail] = useState(false);

    const toggleShowUpdateEmailInterface = () => {
        setUpdateEmail(e => !e)
    };

    return <>
        <div className={styles["main-container-settings"]}>
            {passwordChangeMessage ? <RecoverPasswordEmailSent toggleConfirmationPasswordMesage={toggleConfirmationPasswordMesage} loadingState={submit} /> : null}
            {updateEmail ? <ChangeEmail toggleShowUpdateEmailInterface={toggleShowUpdateEmailInterface} /> : null}
            <div className={styles["main-content"]}>
                <div className={styles["header-container"]}>
                    <button onClick={goBack}>
                        <ArrowGoBack />
                    </button>
                    <h2 className={styles["title"]}>Configuración</h2>
                </div>
                <div className={styles["content-container"]}>

                    {/* Cuenta*/}
                    {!loading ? user?.isAnonymous ? null : (<div className={styles["block"]}>
                        <h3>CUENTA</h3>
                        <div className={styles["buttons-container"]}>
                            <button onClick={toggleConfirmationPasswordMesage}>Cambiar contraseña</button>
                            <button onClick={toggleShowUpdateEmailInterface}>Cambiar correo</button>
                        </div>
                    </div>) : <h3>Cargando...</h3>}

                    {/* Visualization Options */}
                    <div className={styles["block"]}>
                        <h3>OPCIONES DE VISUALIZACIÓN</h3>
                        <div className={styles["buttons-container"]}>
                            <div className={styles["key-value-container"]}>
                                <button className={styles["button-key-container"]}>
                                    <small className={styles["key"]}>Tema</small>
                                </button>
                                <small className={styles["value"]}>Modo Claro</small>
                            </div>
                            <div className={styles["key-value-container"]}>
                                <button className={styles["button-key-container"]}>
                                    <small className={styles["key"]}>Tamaño de la fuente</small>
                                </button>
                                <small className={styles["value"]}>Mediano</small>
                            </div>
                        </div>
                    </div>

                    {/* About the App */}
                    <div className={styles["block"]}>
                        <h3>ACERCA DE</h3>
                        <div className={styles["buttons-container"]}>
                            <button className={styles["button-key-container"]}>Terminos y condiciones</button>
                            <div className={styles["key-value-container"]}>
                                <small className={styles["key"]}>Versión de la App</small>
                                <small className={styles["value"]}>1.0.0</small>
                            </div>
                        </div>
                    </div>

                </div>

                <div className={styles["footer"]}>
                    <div className={styles["terms-and-conditions-container"]}>
                        <a href="#" className={styles["terms-and-conditions"]}>
                            <small>Terminos y Condiciones legales</small>
                        </a>
                    </div>
                </div>
            </div>
        </div >
    </>
};

export default Settings;