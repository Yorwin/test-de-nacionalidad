"use client"

import { useState, useEffect } from "react";
import styles from "@/styles/layout/results/graphic-test-made.module.scss";
import { useAuth } from "@/context/auth-context";
import { isTestValid } from "@/functions/functions";

/* Firebase */
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const GraphicTestsMade = () => {

    const { user, loading: authLoading } = useAuth();

    const [totalTests, setTestsTotal] = useState(0);
    const [correctTests, setCorrectTests] = useState(0);
    const [incorrectTests, setIncorrectTests] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        /* Obtener simulaciones de Firestore */
        const getTestsResults = async () => {
            if (!user) {
                return null;
            }

            try {
                const totalTestsResults: number[] = [];
                const resultsRef = collection(db, "users", user.uid, "resultados");
                const querySnapshot = await getDocs(resultsRef);

                querySnapshot.forEach(doc => {
                    const data = doc.data();

                    if (data.testId === "test_simulation") {
                        const score = data.score;
                        totalTestsResults.push(score);
                    }
                })

                /* Total de Simulaciones */
                setTestsTotal(totalTestsResults.length);

                /* Simulaciones aprobadas */
                const approvedTests = isTestValid(totalTestsResults);
                setCorrectTests(approvedTests);

                /* Simulaciones fallidas */
                const incorrectTests = totalTestsResults.length - approvedTests;
                setIncorrectTests(incorrectTests);

            } catch (error) {
                console.error(`Error al intentar obtener los resultados de las simulaciones ${error}`);
            } finally {
                setLoading(false);
            }
        };

        getTestsResults();
    }, [user]);

    if ((!user && authLoading) || loading) {
        return (
            <div className={styles["skeleton-standard-container"]}>
                <div className={`skeleton-rect ${styles["skeleton-standard"]}`}></div>
            </div>
        )
    }

    return <>
        <div className={styles["main-container-tests"]}>
            <div className={styles["data-container"]}>
                <h2>Pruebas CCSE realizadas</h2>
                <small>{totalTests}</small>
            </div>
            <div className={styles["shared-data-container"]}>
                <div className="first-item">
                    <h2>Apto</h2>
                    <small>{correctTests}</small>
                </div>
                <div className="second-item">
                    <h2>No Apto</h2>
                    <small>{incorrectTests}</small>
                </div>
            </div>
        </div>
    </>
};

export default GraphicTestsMade;