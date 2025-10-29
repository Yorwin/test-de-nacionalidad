import styles from "@/styles/layout/results/progress-next-back-results.module.scss";

interface directionArrowsAndModule {
    goBack: () => void,
    goForward: () => void,
    module: number,
}

const ProgressNextBack = ({ goBack, goForward, module }: directionArrowsAndModule) => {
    return <>
        <div className={styles["arrow-back"]}>
            <button type="button" className={styles["arrow-results"]} onClick={goBack}>
                <i className="bi bi-caret-left"></i>
            </button>
        </div>
        <div className={styles["progress-container"]}>
            {[0, 1, 2, 3, 4].map((index) => (
                <div
                    key={index}
                    className={styles["progress-circle"]}
                    style={{ backgroundColor: index <= module ? 'red' : '' }}
                ></div>
            ))}
        </div>
        <div className={styles["arrow-next"]}>
            <button type="button" className={styles["arrow-results"]} onClick={goForward}>
                <i className="bi bi-caret-right"></i>
            </button>
        </div>
    </>
};

export default ProgressNextBack;