import React, { useEffect } from "react";
import styles from "@/styles/layout/simulacion-de-prueba/check-test-simulation.module.scss"
import { useCounter } from "@/context/counter-simulacion-prueba";

interface CheckTestSimulationProps {
    cancelShowCheckTestMessage: () => void,
    showResults: () => void,
}

const CheckTestSimulation = ({ cancelShowCheckTestMessage, showResults }: CheckTestSimulationProps) => {

    const { pauseTimer, startTimer } = useCounter();

    useEffect(() => {
        pauseTimer();
    });

    const handleCancelShowTestMessage = () => {
        cancelShowCheckTestMessage();
        startTimer();
    };

    return <>
        <div className={styles["main-container-check-test"]}>
            <div className={styles["check-container"]}>
                <div className={styles["container-text-info"]}>
                    <h2>¿Estás seguro de finalizar la evaluación?</h2>
                    <p>Una vez confirmes ya no podrás realizar cambios en tus respuestas</p>
                    <p><strong>⚠️ Las respuestas en blanco serán consideradas incorrectas.</strong></p>
                    <p>Si estás listo, haz clic en "Confirmar y enviar".</p>
                    <p>Si necesitas revisar algo, puedes volver atrás.</p>
                </div>
                <div className={styles["container-buttons"]}>
                    <button onClick={handleCancelShowTestMessage}>No quiero confirmar aún</button>
                    <button onClick={showResults}>Confirmar y enviar</button>
                </div>
            </div>
        </div>
    </>
};

export default CheckTestSimulation;