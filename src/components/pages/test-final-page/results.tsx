"use client"

import React, { useEffect, useState } from "react";
import styles from "@/styles/layout/simulacion-de-prueba/check-test-simulation.module.scss";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from 'firebase/firestore';

/* Context */
import { useAuth } from "@/context/auth-context";

type TestData = {
    testId: string;
    score: number;
    answers: any[];
    duration: number;
    questions: any[];
    Date: string;
};

const Results = ({ testId }: { testId: string }) => {

    const { user } = useAuth();

    const [testData, setTestData] = useState<TestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const total = 25;

    useEffect(() => {
        const fetchTestData = async () => {
            if (!user) {
                return;
            }

            try {
                const docRef = doc(db, 'users', user.uid, 'resultados', testId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTestData(docSnap.data() as TestData);
                } else {
                    setError("Test no encontrado");
                }
            } catch (err) {
                console.error("Error al obtener datos del test:", err);
                setError("Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchTestData();
    }, [user, testId]);

    if (loading) {
        return (<div className={styles["results-data-container"]}>
            <div className={`skeleton-rect ${styles["result-item"]}`}></div>
            <div className={`skeleton-rect ${styles["result-item"]}`}></div>
        </div>);
    }

    if (error) {
        return (
            <p>Error: {error}</p>
        );
    }

    if (!testData) {
        return (
            <p>No se encontraron datos</p>
        );
    }

    if (testData) {
        return (
            <div className={styles["results-data-container"]}>
                <p>Cantidad de aciertos: {testData.score}</p>
                <p>Cantidad de fallos: {total - testData.score}</p>
            </div>
        )
    }
};

export default Results;