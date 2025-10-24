"use client"

import { useEffect, useState } from "react";
import styles from "../styles/test-results-page.module.css"
import { auth, db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import LoadingScreen from "@/components/loading-screen";

interface TestResultsProps {
    goBackToHome: () => void;
    resultId: string,
}

const TestResultsPage = ({ goBackToHome, resultId }: TestResultsProps) => {

    const user = auth.currentUser;

    if (!user) {
        throw new Error("No se ha encontrado el usuario");
    }

    const [loading, setIsLoading] = useState(false);
    const [resultsInfo, setResultsInfo] = useState<any>({});

    useEffect(() => {
        const getTestResults = async (docId: string) => {
            try {
                setIsLoading(true);

                const docRef = doc(db, 'users', user.uid, 'resultados', docId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const doc = { id: docSnap.id, ...docSnap.data() };
                    setResultsInfo(doc);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error al intentar obtener las preguntas" + error);
            }
        }

        getTestResults(resultId);
    }, []);

    if (loading) {
        return (<LoadingScreen />)
    }

    return (
        <div className={styles["main-container-test-results"]}>
            <div className={styles["title-results"]}>
                <h2>Resultados del test</h2>
            </div>
            <div className={styles["test-results"]}>
                <p>Se han acertado {resultsInfo.score}/{resultsInfo.answers?.length} preguntas</p>
            </div>
            <div className={styles["go-back-home-button"]}>
                <button onClick={goBackToHome}>Go Back</button>
            </div>
        </div>
    )
};

export default TestResultsPage;