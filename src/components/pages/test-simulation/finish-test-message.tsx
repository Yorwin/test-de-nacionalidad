import React, { useEffect } from "react";
import { useCounter } from "@/context/counter-simulacion-prueba";
import styles from "@/styles/layout/simulacion-de-prueba/finish-test-message.module.scss";

const FinishTestMessage = ({ cancelExitSimulation, continueExitSimulation }: { cancelExitSimulation: () => void, continueExitSimulation: () => void }) => {

    const { pauseTimer, startTimer } = useCounter();

    useEffect(() => {
        pauseTimer();
    });

    const handleExitSimulation = () => {
        cancelExitSimulation();
        startTimer();
    }

    return <>
        <div className={styles["main-container-confirm-exit"]}>
            <div className={styles["container-confirm-exit"]}>
                <div className={styles["first-text-part"]}>
                    <i className="bi bi-exclamation-diamond"></i>
                    <p> ¿Estás seguro de que quieres salir?</p>
                </div>
                <div className={styles["second-text-part"]}>
                    <p> Si sales ahora, la prueba terminará y tus respuestas no se guardarán. ¡Esta acción no se puede deshacer!</p>
                </div>
                <ul className={styles["options-list"]}>
                    <li>
                        <i className="bi bi-caret-right-fill"></i>
                        Pulsa <strong>"Cancelar"</strong> para continuar la prueba
                    </li>
                    <li>
                        <i className="bi bi-caret-right-fill"></i>
                        Pulsa <strong>"Salir"</strong> si deseas terminar
                    </li>
                </ul>
                <div className={styles["container-buttons"]}>
                    <button onClick={handleExitSimulation}>Cancelar</button>
                    <button onClick={continueExitSimulation}>Salir</button>
                </div>
            </div>
        </div >
    </>
}

export default FinishTestMessage;