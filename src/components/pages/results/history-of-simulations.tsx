"use client"

import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import noInfoImage from "@/resources/undraw_page-eaten_b2rt.svg"
import { getFullDate } from "@/functions/functions";
import styles from "@/styles/layout/results/graphic-test-made.module.scss";
import Image from "next/image";

/* Firebase */
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";

/* Context */
import { useAuth } from "@/context/auth-context";

const HistoryOfSimulations = () => {

    const { user, loading: authLoading } = useAuth();

    const [testResults, setTestResults] = useState<ReactNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [displayLimit, setDisplayLimit] = useState(5);

    const getResults = async () => {

        if (!user) {
            return null;
        }

        try {
            const resultsRef = collection(db, "users", user.uid, "resultados");

            const q = query(resultsRef, where("testId", "==", "test_simulation"));
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return data;
        } catch (error) {
            console.error(`Error al intentar cargar historial de resultados`);
        }
    };

    const calculateApproved = (e: number) => {
        if (e >= 20) {
            return "Apto";
        } else {
            return "No Apto";
        }
    }

    const calculateRightAnswerPercentage = (e: number) => {
        const totalQuestions = 25;
        const rightTests = e;

        const successPercentage = rightTests / totalQuestions;
        const percentage = Math.round(successPercentage * 100);

        return percentage;
    };

    const getTotalRightAnswers = (e: number) => {
        const totalQuestions = 25;
        return `${e}/${totalQuestions}`
    };

    const processedResults = async () => {
        try {
            const getResultsUser = await getResults();

            if (!getResultsUser) {
                return null;
            }

            const processedArray = getResultsUser.map((e: any) => ({
                id: e.id,
                date: e.Date,
                totalRightAnswers: getTotalRightAnswers(e.score),
                approved: calculateApproved(e.score),
                percentage: calculateRightAnswerPercentage(e.score),
                secondsSinceMidNight: e.secondsSinceMidNight,
            }));

            const sortedArray = processedArray.sort((a, b) => {

                const today = getFullDate();

                // Verificar cual de los dos Items corresponde a TODAY. 
                const aIsToday = a.date === today;
                const bIsToday = b.date === today;

                // Si uno corresponde a TODAY y el otro no TODAY va a ir primero. 
                if (aIsToday && !bIsToday) return -1;
                if (!aIsToday && bIsToday) return 1;

                // Si ambos son de hoy, o ambos son de diferentes días organizaremos usando secondsSinceMidNight desde el más nuevo. 
                if (aIsToday && bIsToday) {
                    return b.secondsSinceMidNight - a.secondsSinceMidNight;
                } else {

                    // Para elementos de días diferentes, analiza y compara las fechas.
                    const [aDay, aMonth, aYear] = a.date.split('/').map(Number);
                    const [bDay, bMonth, bYear] = b.date.split('/').map(Number);

                    // Compara años. 
                    if (aYear !== bYear) return bYear - aYear;

                    // Compara meses. 
                    if (aMonth !== bMonth) return bMonth - aMonth;

                    // Compara días.
                    if (aDay !== bDay) return bDay - aDay;

                    // Si la fecha es la misma pero no es de hoy, organizar usando los segundos. 
                    return b.secondsSinceMidNight - a.secondsSinceMidNight;
                }
            });

            const limitedArray = sortedArray.slice(0, displayLimit);

            let showSimulations = limitedArray.map((e, index) => {
                return (
                    <div className={styles["simulation"]} key={`${index}-simulation`}>
                        <p>{e.date}</p>
                        <p className={styles["optional-value"]}>{e.totalRightAnswers}</p>
                        <p>{e.approved}</p>
                        <p className={styles["optional-value"]}>{`${e.percentage}%`}</p>
                        <p>
                            <Link href={`/resultados/respuestas/${e.id}`} className={styles["button-simulation-result"]}>
                                Respuestas
                            </Link>
                        </p>
                    </div>
                )
            })

            setTestResults(showSimulations);

        } catch (error) {
            console.error(`Hemos presentado un error, ${error}`)
        } finally {
            setIsLoading(false);
        }
    };

    const increaseDisplayLimit = () => {
        setDisplayLimit(prevLimit => prevLimit + 5);
    };

    useEffect(() => {
        processedResults();
    }, [displayLimit, user]);

    return (
        <div className={styles["container-history-simulations"]}>
            <h2 className={styles["title"]}>Historial de Simulaciones</h2>
            {isLoading || authLoading ? (
                <div className={styles["container-simulations"]}>
                    <div className={styles["history-result-container-skeleton"]}>
                        <div className={`skeleton-rect ${styles["skeleton-standard"]}`}></div>
                    </div>
                    <div className={styles["history-result-container-skeleton"]}>
                        <div className={`skeleton-rect ${styles["skeleton-standard"]}`}></div>
                    </div>
                    <div className={styles["history-result-container-skeleton"]}>
                        <div className={`skeleton-rect ${styles["skeleton-standard"]}`}></div>
                    </div>
                </div>
            ) : testResults.length > 0 ? (
                <>
                    <div className={styles["container-simulations"]}>
                        {testResults}
                        <small className={styles["notation"]}>Datos de una prueba aleatoria sin valor legal</small>
                    </div>
                    <button className={styles["button-see-more"]} onClick={increaseDisplayLimit}>Ver más...</button>
                </>
            ) : (
                <div className={styles["container-simulations"]}>
                    <div className={styles["container-no-data"]}>
                        <div className={styles["container-image"]}>
                            <Image
                                src={noInfoImage}
                                alt="Imagen no tenemos información"
                                className={styles["img-no-data"]}
                                fill
                            />
                        </div>
                        <p>No tenemos información que poder mostrarte, comienza a prácticar para que puedas ver datos</p>
                    </div>
                </div>
            )}
        </div>
    )
};

export default HistoryOfSimulations;