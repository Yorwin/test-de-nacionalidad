"use client"

import React from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { auth } from '@/firebase/firebase'
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import SpinningElement from "@/components/pages/recover-password/spinning";
import WritingMachineText from "@/components/pages/recover-password/writing-machine";
import styles from "@/styles/layout/recover-password/recover-password.module.scss"
import LoadingScreen from "@/components/loading-screen";

const RecoverPasswordPage = () => {

    /* Comprobar parametros de la URL */
    const searchParams = useSearchParams();

    /* Preparamos el useRouter */
    const router = useRouter();

    /* Estado y mensaje de error de validación del codigo oobCode */
    const [isValidCode, setIsValidCode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    /* Contraseñas */

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    /* Validación de contrañas */

    const [passwordsAreValid, setPasswordAreValid] = useState(false);

    /* Mensajes contraseña y Submit*/

    const [message, setMessage] = useState("");
    const [messageSubmit, setMessageSubmit] = useState("");

    useEffect(() => {
        const oobCode = searchParams.get("oobCode");

        if (!oobCode) {
            setErrorMessage("❌ Acceso denegado: No tienes permiso para ver esta página.");
            setTimeout(() => router.replace("/autorizacion/iniciar-sesion"), 4000); // Redirige después de 4 segundos
            return;
        }

        verifyPasswordResetCode(auth, oobCode)
            .then(() => setIsValidCode(true))
            .catch(() => {
                setErrorMessage("❌ Código inválido o expirado.");
                setTimeout(() => router.replace("/autorizacion/iniciar-sesion"), 4000);
            })
    }, [searchParams]);

    /* Validación Contraseñas */

    const validatePasswords = () => {
        if (newPassword === confirmNewPassword && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{8,}$/.test(newPassword)) {
            setPasswordAreValid(true);
            setMessage("");
        } else if (newPassword !== confirmNewPassword) {
            setMessage("Tus contraseñas no coinciden")
            setPasswordAreValid(false);
        } else if (newPassword !== "" && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{8,}$/.test(newPassword)) {
            setMessage("Es recomendable que tu contraseña tenga mayusculas, minusculas, números y al menos 8 caracteres")
            setPasswordAreValid(false);
        } else if (newPassword === "" || confirmNewPassword === "") {
            setMessage("");
            setPasswordAreValid(false);
        }
    }

    useEffect(() => {
        validatePasswords();
    }, [newPassword, confirmNewPassword])

    /* Mostrar Contraseña */

    const [showPassword, setShowPassword] = useState("password");
    const [showPasswordConfirm, setShowPasswordConfirm] = useState("password");

    const togglePassword = () => {
        if (showPassword === "password") {
            setShowPassword("text");
        } else {
            setShowPassword("password")
        }
    };

    const togglePasswordConfirm = () => {
        if (showPasswordConfirm === "password") {
            setShowPasswordConfirm("text");
        } else {
            setShowPasswordConfirm("password")
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const oobCode = searchParams.get("oobCode");

        if (oobCode) {
            try {
                await confirmPasswordReset(auth, oobCode, newPassword)
                setMessageSubmit("✅ Contraseña restablecida con éxito.")
                setTimeout(() => router.replace("/autorizacion/iniciar-sesion"), 4000);
            } catch (error) {
                setMessageSubmit("Ha ocurrido un error ❌");
            }
        }
    }

    if (errorMessage) {
        return (
            <div className={styles["container-success-error-message"]}>
                <p>{errorMessage}</p>
                <SpinningElement />
                <WritingMachineText />
            </div>
        )
    }

    if (!isValidCode) {
        return (
            <LoadingScreen />
        );
    }

    return <>
        <div className={styles["container-recover-password"]}>
            <div className={styles["container-recover-password-content"]}>

                {/* Titulo */}

                <h2>Ingresa tu nueva contraseña</h2>

                {/* Formulario */}

                <form className={styles["form-container"]} onSubmit={handleResetPassword}>

                    <div className={styles["input-container"]}>
                        <input type={showPassword}
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required />
                        <button type="button" onClick={togglePassword} className={styles["show-password"]}>{showPassword === "password" ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}</button>
                    </div>

                    <div className={styles["input-container"]}>
                        <input
                            type={showPasswordConfirm}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Confirmar nueva contraseña"
                            required />
                        <button type="button" onClick={togglePasswordConfirm} className={styles["show-password"]}>{showPasswordConfirm === "password" ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}</button>
                    </div>

                    <div className={styles["input-container"]}>
                        <button className={styles["submit-button"]} type="submit" disabled={!passwordsAreValid}>Reestablecer Contraseña</button>
                    </div>

                    {/* Mensaje Validaciones Contraseña */}
                    {message && <p className={styles["message-password-validation"]}>{message}</p>}

                </form>

                {/* Mensaje Submit */}

                {messageSubmit && (
                    <div className={styles["container-success-error-message"]}>
                        <p>{messageSubmit}</p>
                        <SpinningElement />
                        <WritingMachineText />
                    </div>
                )}
            </div>
        </div>
    </>
};

export default RecoverPasswordPage;