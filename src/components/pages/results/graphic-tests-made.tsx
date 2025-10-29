"use client"

import styles from "@/styles/layout/results/graphic-test-made.module.scss";
import { useAuth } from "@/context/auth-context";

interface testsInfo {
    correctTests: number,
    incorrectTests: number,
    totalTests: number,
}

const GraphicTestsMade = ({ correctTests, incorrectTests, totalTests }: testsInfo) => {

    const { userData, loading: authLoading } = useAuth();

    if(!userData && authLoading) {
        return (
            <h3>Cargando resultados...</h3>
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