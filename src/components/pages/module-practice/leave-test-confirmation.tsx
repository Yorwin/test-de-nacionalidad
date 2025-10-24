import styles from "../styles/leave-test-confirmation.module.css"

interface leaveTestConfirmationProps {
    leaveTest: () => void;
    toggleLeaveTestMessage: () => void;
}

const leaveTestConfirmation = ({ leaveTest, toggleLeaveTestMessage }: leaveTestConfirmationProps) => {

    return (
        <div className={styles["main-container-leave-test"]}>
            <div className={styles["message-container"]}>
                <h2>¿Seguro que quiere salir del test?</h2>
                <div className={styles["parragraph-container"]}>
                    <p>Si abandonas el test ahora, tus respuestas no serán evaluadas ni registradas
                        para tu progreso. Esta acción no se puede deshacer.</p>
                    <p>¿Quieres salir de todas formas?</p>
                </div>
                <div className={styles["button-container"]}>
                    <button onClick={toggleLeaveTestMessage} className={styles["cancel-button"]}>Cancelar</button>
                    <button onClick={leaveTest} className={styles["leave-button"]}>Salir sin guardar</button>
                </div>
            </div>
        </div>
    )
};

export default leaveTestConfirmation;