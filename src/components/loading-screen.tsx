import React, { useState, useEffect } from "react";
import styles from "@/styles/components/loading-screen.module.scss";

export default function LoadingScreen() {
    const text = "Cargando...";
    const [displayedText, setDisplayedText] = useState("");
    const typingSpeed = 150; // Velocidad del efecto de escritura

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText(text.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
            }
        }, typingSpeed);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles["loading-screen"]}>
            <div className={styles["spinner"]}></div>
            <h2 className={styles["loading-text"]}>{displayedText}</h2>
        </div>
    );
} 