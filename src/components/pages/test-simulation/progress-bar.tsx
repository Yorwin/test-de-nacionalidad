import styles from "@/styles/layout/simulacion-de-prueba/progress-bar.module.scss";

const ProgressBar = ({ progress }: { progress: string }) => {
    return <>
        <div className={styles["progress-bar-container"]}>
            <div className={styles["progress-bar"]}
                style={{ width: `${progress}` }}></div>
        </div>
    </>
};

export default ProgressBar;