import styles from "@/styles/layout/practica-por-modulo/test-page.module.scss";

const QuestionsCounter = ({ totalQuestions, currentQuestion }: { totalQuestions: number, currentQuestion: number }) => {
    return (
        <small className={styles["question-counter-text"]}>Pregunta {currentQuestion + 1}/{totalQuestions}</small>
    )
}

export default QuestionsCounter;