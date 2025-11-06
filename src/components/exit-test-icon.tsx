import styles from "@/styles/components/exit-test-icon.module.scss";

const ExitTestIcon = ({ showConfirmMessage }: { showConfirmMessage: () => void }) => {
    return <>
        <div className={styles["container-exit-icon"]}>
            <button onClick={showConfirmMessage} className={styles["button-exit-simulation"]}>
                <i className="bi bi-x-circle-fill"></i>
                <h2>Salir Prueba</h2>
            </button>
        </div>
    </>
}

export default ExitTestIcon;