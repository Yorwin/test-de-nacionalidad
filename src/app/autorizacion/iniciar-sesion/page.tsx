"use client"

import React, { useState } from "react";
import styles from "@/styles/layout/auth-pages/auth-pages.module.scss"
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase"
import { useRouter } from "next/navigation";
import RecoverPassword from "@/components/recover-password";

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPasswordRecover, setShowPasswordRecover] = useState(false);
    const [showPassword, setShowPassword] = useState("password");
    const [submit, setSubmit] = useState(false);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmit(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
            setSubmit(false);
        } catch (error) {
            setError("Correo o contraseña incorrectos ❌.")
            setSubmit(false);
        }
    }

    const togglePassword = () => {
        if (showPassword === "password") {
            setShowPassword("text");
        } else {
            setShowPassword("password")
        }
    };

    const handleRecoverPassword = () => {
        setShowPasswordRecover(!showPasswordRecover)
    }

    return <>
        <div className={styles["login-page-container"]}>

            {/* Titulo */}
            <div className={styles["login-header"]}>
                <h2>Hola!</h2>
                <p>Bienvenido al Instituto Cervantes</p>
            </div>

            {error && <p className={styles["mensaje-error-login"]}>{error}</p>}
            <form className={styles["formulario-login"]} onSubmit={handleLogin}>

                <div className={styles["inputs"]}>
                    <div className={styles["container-input-login-register"]}>

                        {/* Enlaces */}
                        <div className={styles["container-input"]}>
                            <input id="e-mail-login"
                                type="e-mail"
                                placeholder="E-mail"
                                className={styles["login-input"]}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className={styles["container-input"]}>
                            <input id="password-login"
                                type={showPassword}
                                placeholder="Contraseña"
                                className={styles["login-input"]}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" onClick={togglePassword} className={styles["show-password-login"]}>{showPassword === "password" ? <i className="bi bi-eye"></i> : <i className="bi bi-eye-slash"></i>}</button>
                        </div>

                        {/* Has olvidado tu contraseña? Enlace */}
                        <div className={styles["container-forgotten-password"]}>
                            <button type="button" className={styles["button-forgotten-password"]} onClick={handleRecoverPassword}>Has olvidado tu contraseña?</button>
                        </div>

                        {/* Boton Iniciar sesión */}
                        <div className={styles["container-button-submit"]}>
                            <button className={styles["button"]} type="submit">{submit ? (
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                </div>
                            ) : "Iniciar sesión"}</button>
                        </div>
                    </div>
                </div>

                {/* Enlace Registro */}
                <p>No tienes una cuenta? <Link href={"/registrarse"}>Registrate</Link></p>
            </form>
            {showPasswordRecover && <RecoverPassword show={handleRecoverPassword} />}
        </div>
    </>
};

export default LoginPage;