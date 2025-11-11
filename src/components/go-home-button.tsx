import Link from "next/link";
import styles from "@/styles/layout/simulacion-de-prueba/test-results.module.scss";

const GoHomeButton = () => {
    return (
        <Link className={styles["go-home-button"]} href={"/"}>
            <i className="bi bi-house-door"></i>
            <small>Volver al Home</small>
        </Link>
    );
};

export default GoHomeButton;