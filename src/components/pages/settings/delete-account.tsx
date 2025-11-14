"use client";

import React, { useState } from 'react';
import styles from "@/styles/layout/settings/delete-account.module.scss";
import { getAuth, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useRouter } from 'next/navigation';

const DeleteAccount = ({ toggleShowDeleteInterface }: { toggleShowDeleteInterface: () => void }) => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const auth = getAuth();
    const router = useRouter();

    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const user = auth.currentUser;
        if (!user || !user.email) {
            setMessage({ text: 'Usuario no autenticado o sin correo.', type: 'error' });
            setLoading(false);
            return;
        }

        try {
            // Reautenticar con la contraseña actual
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            // Eliminar datos del usuario en Firestore
            await deleteDoc(doc(db, 'users', user.uid));

            // Eliminar la cuenta en Firebase Auth
            await deleteUser(user);

            // Redirigir después de la eliminación (ej. a la página principal)
            router.push('/');
        } catch (error: any) {
            let errorMessage = 'Error al eliminar la cuenta.';
            if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Por favor, vuelve a iniciar sesión para confirmar.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Contraseña incorrecta.';
            }
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (auth.currentUser?.isAnonymous) {
        return (
            <div className={styles["main-container"]}>
                <div className={styles["delete-account-container"]}>
                    <h2 className={styles["anonymous-account-title"]}>No se puede eliminar una cuenta de invitado</h2>
                    <div className={styles["close-icon-container"]}>
                        <button onClick={toggleShowDeleteInterface}>
                            <i className="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles["main-container"]}>
            <div className={styles["delete-account-container"]}>
                <h2 className={styles["title"]}>¿Estás seguro de que quieres eliminar tu cuenta?</h2>
                <p>Esta acción es irreversible y eliminará todos tus datos.</p>

                {message.text && (
                    <div className={styles[`message ${message.type}`]}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleDelete}>
                    <div className={styles["form-group"]}>
                        <label className={styles["label-style"]} htmlFor="password">Confirma tu contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className={styles["btn-delete"]}>
                        {loading ? 'Eliminando...' : 'Eliminar Cuenta'}
                    </button>
                    <button type="button" onClick={toggleShowDeleteInterface} className={styles["btn-cancel"]}>Cancelar</button>
                </form>
                <div className={styles["close-icon-container"]}>
                    <button onClick={toggleShowDeleteInterface}>
                        <i className="bi bi-x"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccount;