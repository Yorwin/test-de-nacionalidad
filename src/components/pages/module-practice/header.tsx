"use client"

import ArrowGoBack from "../../../components/arrow-go-back"
import { useRouter } from "next/navigation"
import styles from "@/styles/layout/practica-por-modulo/practica-por-modulo.module.scss";

const Header = () => {
    
    const router = useRouter();

    const GoBack = () => {
        router.back();
    };

    return (
        <div className={styles["header-container"]}>
            <div className={styles["module-practice-title"]}>
                <h2>ESCOGE EL MODULO A PRACTICAR</h2>
            </div>
            <button onClick={GoBack} className={styles["arrow-container"]}>
                <ArrowGoBack />
            </button>
        </div>
    )
}

export default Header;