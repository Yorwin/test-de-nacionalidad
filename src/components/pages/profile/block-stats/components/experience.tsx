"use client"

import { useEffect, useState } from "react";
import styles from "@/styles/layout/profile/blockstats.module.scss";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const Experience = ({ userId }: { userId: string }) => {

    const [experience, setExperience] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExperience = async () => {

            try {
                setLoading(true);

                const userRef = doc(db, `users/${userId}`);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setExperience(data.experience ?? 0); // Si no existe el campo, lo dejamos en 0
                } else {
                    console.warn('El documento del usuario no existe');
                    setExperience(0);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error obteniendo experiencia:', err);
                setError('No se pudo obtener la experiencia');
                setLoading(false);
            }
        };

        fetchExperience();
    }, [userId]);

    if (loading) return <div> Calculando tu experiencia...</div>;
    if (error) return <div> Error: {error}</div>;

    return (
        <div className={styles["block-container"]}>
            <div className={styles["icon-container"]}>
                <i className="bi bi-stars"></i>
            </div>
            <div className={styles["info-container"]}>
                <p className={styles["result"]}>{experience}</p>
                <p className={styles["type-of-stat"]}>EXP Totales</p>
            </div>
        </div>
    )
}

export default Experience;