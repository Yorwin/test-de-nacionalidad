"use client"

import React, { useState } from 'react';
import styles from "@/styles/layout/settings/change-email.module.scss";
import { getAuth, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const ChangeEmail = ({ toggleShowUpdateEmailInterface }: { toggleShowUpdateEmailInterface: () => void }) => {

    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPasword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const auth = getAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const user = auth.currentUser;

        if (!user) {
            throw new Error("No hay usuario autenticado");
        }

        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {

            if (user.email === null) {
                throw new Error("No se ha logrado acceder al correo del usuario")
            }

            // Reautenticar al usuario antes de hacer cambios sensibles
            const credencial = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await reauthenticateWithCredential(user, credencial);

            // Actualizar el correo electrónico
            await updateEmail(user, newEmail);

            // Opcionalmente enviar correo de verificación
            // await sendEmailVerification(usuario);

            setMessage({
                text: "Correo electrónico actualizado correctamente. Por favor, verifica tu nuevo correo.",
                type: "success"
            });

            // Limpiar el formulario
            setNewEmail('');
            setCurrentPasword('');

        } catch (error) {
            let mensajeError = "Error al actualizar el correo electrónico";

            setMessage({
                text: mensajeError,
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    if (auth.currentUser?.isAnonymous) {
        return (
            <div className={styles["main-container"]}>
                <div className={styles["change-email-container"]}>
                    <h2 className={styles["anonymous-account-title"]}>No se puede cambiar el correo en una cuenta de invitado</h2>
                    <div className={styles["close-icon-container"]}>
                        <button onClick={toggleShowUpdateEmailInterface}>
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles["main-container"]}>
            <div className={styles["change-email-container"]}>
                <h2 className={styles["title"]}>Cambiar Correo Electrónico</h2>

                {message.text && (
                    <div className={styles[`message ${message.type}`]}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles["form-group"]}>
                        <label className={styles["label-style"]} htmlFor="newEmail">Nuevo Correo Electrónico:</label>
                        <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles["form-group"]}>
                        <label className={styles["label-style"]} htmlFor="currentPassword">Contraseña Actual:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPasword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles["btn-change"]}
                    >
                        {loading ? 'Procesando...' : 'Cambiar Correo'}
                    </button>
                </form>
                <div className={styles["close-icon-container"]}>
                    <button onClick={toggleShowUpdateEmailInterface}>
                        <i className="bi bi-x"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeEmail;