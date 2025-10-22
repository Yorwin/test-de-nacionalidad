import React from "react";
import styles from "@/styles/layout/auth-pages/continue-guest-user.module.scss";
import Link from "next/link";

const ContinueGuestUser = () => {
    return (
        <section className={styles["continue-guest-user-container"]}>
            <i className="bi bi-person"></i>
            <Link className={styles["link"]} href="/">Continua con un usuario de invitado</Link>
        </section>
    )
};

export default ContinueGuestUser;