"use client"

import React, { ChangeEvent, FormEvent, useState } from "react";
import { auth } from "@/firebase/firebase";
import styles from "@/styles/layout/auth-pages/auth-pages.module.scss"
import { sendPasswordResetEmail } from "firebase/auth";

interface ButtonProps {
    show: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const RecoverPassword = ({ show }: ButtonProps) => {

    const [emailRecover, setEmailRecover] = useState("");
    const [message, setMessage] = useState<React.ReactNode>(<></>);
    const [emailSent, setEmailSent] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const messageContent = (
        <div className={styles["message-recover-container"]}>
            <h2>✉️ ¡Revisa tu bandeja de entrada!</h2>
            <div className={styles["container-parragraphs-recover-password-message"]}>
                <p>Te hemos enviado un correo con las instrucciones para restablecer tu contraseña.</p>
                <p>Si no lo ves en unos minutos, revisa tu carpeta de spam o correo no deseado.</p>
                <p>Si necesitas más ayuda, no dudes en contactarnos.</p>
            </div>
            <div className={styles["in-case-of-error-message"]}>
                <p>📩 ¿No recibiste el correo?</p>
                <button onClick={() => handleResetPassword({ preventDefault: () => { } } as FormEvent<HTMLFormElement>)}>Reenviar</button>
            </div>
        </div>
    )

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmailRecover(value);
        // Limpiar mensaje de error cuando el usuario escribe
        if (errorMessage) {
            setErrorMessage("");
        }
    }

    const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmit(true);
        setErrorMessage("");

        try {
            // Primero intentamos enviar el correo directamente
            await sendPasswordResetEmail(auth, emailRecover);

            // Si llega aquí sin error, el correo existe
            setSubmit(false);
            setMessage(messageContent);
            setEmailSent(true);

        } catch (error) {
            setSubmit(false);

            if (error instanceof Error) {
                const errorCode = error.message;

                // Detectar si el error es porque el usuario no existe
                if (errorCode.includes("user-not-found") ||
                    errorCode.includes("auth/user-not-found") ||
                    errorCode.includes("no user record")) {
                    setErrorMessage("❌ El correo ingresado no tiene una cuenta vinculada en el sistema.");
                } else {
                    // Otro tipo de error (red, servidor, etc.)
                    console.error("Error en recuperación:", error);
                    setErrorMessage("❌ Error: Ha ocurrido un problema al procesar tu solicitud.");
                }
            } else {
                setErrorMessage("❌ Error desconocido al enviar el correo de recuperación.");
            }
        }
    };

    return <>
        <div className={styles["recover-password-container"]}>
            <div className={styles["recover-password-content-container"]}>
                <div className={styles["icon-container"]}>
                    <i onClick={show} className="bi bi-x-square"></i>
                </div>
                <div className={styles["form-container"]}>

                    {emailSent ? <p className={styles["message-recover-password"]}>{message}</p> :
                        (<>
                            <h1>Recuperar Contraseña</h1>
                            <form onSubmit={handleResetPassword}>
                                <input type="email"
                                    name="e-mail-recover-field"
                                    placeholder="Ingresa tu email"
                                    value={emailRecover}
                                    onChange={(e) => handleEmailChange(e)}
                                    required />

                                {errorMessage && (
                                    <div className={styles["error-message"]}>
                                        {errorMessage}
                                    </div>
                                )}

                                <button type="submit" className={styles["button"]}>{submit ? (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                ) : "Enviar correo"}</button>
                            </form>
                        </>
                        )
                    }
                </div>
            </div>
        </div>
    </>
};

export default RecoverPassword;