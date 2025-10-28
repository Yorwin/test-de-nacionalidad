import styles from "../styles/graphic-test-made.module.css"

interface testsInfo {
    correctTests: number,
    incorrectTests: number,
    totalTests: number,
}

const GraphicTestsMade = ({ correctTests, incorrectTests, totalTests }: testsInfo) => {

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