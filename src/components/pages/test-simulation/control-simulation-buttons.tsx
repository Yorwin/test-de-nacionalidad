import React from "react";
import styles from "@/styles/layout/simulacion-de-prueba/control-simulation-buttons.module.scss";

type ControlSimulationProps = {
    nextModule: () => void;
    buttonState: boolean;
    showCheckTest: () => void;
}

const ControlSimulationButtons = ({ nextModule, buttonState, showCheckTest }: ControlSimulationProps) => {
    return <>
        <div className={styles["control-simuation-buttons-main-container"]}>
            {/* <button>Finalizar Prueba</button> */}
            {buttonState ? <button className={styles["button-continue-module"]} onClick={showCheckTest}>Evaluar</button> : <button className={styles["button-continue-module"]} onClick={nextModule}>Siguiente</button>}
        </div>
    </>
};

export default React.memo(ControlSimulationButtons);