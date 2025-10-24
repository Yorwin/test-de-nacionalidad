import styles from "../styles/test-page.module.css"

const QuestionsCounter = ({ totalQuestions, currentQuestion }: { totalQuestions: number, currentQuestion: number }) => {
    return <>
        <small className={styles["question-counter-text"]}>Pregunta {currentQuestion + 1}/{totalQuestions}</small>
    </>
}

export default QuestionsCounter;