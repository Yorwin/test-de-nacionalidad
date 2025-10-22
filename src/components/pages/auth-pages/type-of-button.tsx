"use client"

import React from "react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/layout/auth-pages/auth-image.module.scss"

type Enlaces = {
    enlace_login: React.ReactElement,
    enlace_register: React.ReactElement,
}

const TypeOfButton = () => {

    const enlaces: Enlaces = {
        enlace_login: <Link href="/autorizacion/iniciar-sesion" className={styles["link-image"]}>Iniciar sesión</Link>,
        enlace_register: <Link href="/autorizacion/registrarse" className={styles["link-image"]}>Registrarse</Link>
    }

    const pathname = usePathname();
    const [buttonJSX, setButtonJSX] = useState<React.ReactNode>(null);

    useEffect(() => {
        if (pathname.includes("iniciar-sesion")) {
            setButtonJSX(enlaces.enlace_register);
        } else if (pathname.includes("registrarse")) {
            setButtonJSX(enlaces.enlace_login);
        }
    }, [pathname]);

    return <>
        {buttonJSX}
    </>
};

export default TypeOfButton;