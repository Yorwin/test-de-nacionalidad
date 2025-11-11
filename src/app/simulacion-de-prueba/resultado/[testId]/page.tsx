import styles from "@/styles/layout/simulacion-de-prueba/test-results.module.scss";

/* Components */
import ResultsWrapper from "@/components/pages/test-final-page/results-wrapper";
import GoHomeButton from "@/components/go-home-button";

type Props = {
    params: Promise<{
        testId: string,
    }>
};

const TestResults = ({ params }: Props) => {
    return (
        <div className={styles["test-results-main-container"]}>
            <h2>Resultados Test</h2>
            <ResultsWrapper params={params} />
            <GoHomeButton />
        </div>
    )
};

export default TestResults;