import { useState, useEffect } from "react";
import styles from "@/styles/layout/recover-password/recover-password.module.scss";

const WritingMachineText = () => {
    const text = "Estás siendo redirigido, por favor espera...";
    const [displayedText, setDisplayedText] = useState("");
    const typingSpeed = 80; // Velocidad en milisegundos

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1)); // Usamos slice en lugar de concatenar
                index++;
            } else {
                clearInterval(interval);
            }
        }, typingSpeed);

        return () => clearInterval(interval);
    }, []);

    return <>
        <div className="d-flex justify-content-center align-items-center my-2" style={{ minHeight: "5vh" }}>
            <h2 className={styles["loading-text-redirect"]}>{displayedText}</h2>
        </div>
    </>
};

export default WritingMachineText;