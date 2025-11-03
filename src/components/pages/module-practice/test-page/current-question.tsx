import styles from "@/styles/layout/practica-por-modulo/test-page.module.scss";
import { questionType, saveAnswersInServer, saveQuestionAnswerLocally } from "@/types/types";
import LoadingScreen from "@/components/loading-screen";

interface CurrentQuestionProps {
    loading: boolean,
    questions: questionType[],
    questionCounter: number,
    selectedAnswer: number | null,
    handleAnswerSelection: (index: number) => void,
    finishModulePractice: saveAnswersInServer,
    saveQuestionAnswer: saveQuestionAnswerLocally,
    isQuestionChecked: boolean,
    checkQuestion: () => void,
};

const CurrentQuestion = ({ loading, questions, questionCounter, selectedAnswer, handleAnswerSelection, finishModulePractice, saveQuestionAnswer, isQuestionChecked, checkQuestion }: CurrentQuestionProps) => {

    if (loading || questions.length === 0 || questionCounter >= questions.length) {
        return <LoadingScreen />;
    }

    const currentQuestion = questions[questionCounter];
    const isCorrect = selectedAnswer === currentQuestion.correcta;

    return (
        <div className={styles["question-container"]}>
            <div className={styles["question-content-container"]}>
                <div className={styles["question-title"]}>
                    {isQuestionChecked && (
                        <div className={styles["answer-state"]}>
                            <small>{isCorrect ? "Correcto!" : "Incorrecto"}</small>
                        </div>
                    )}
                    <h3>{currentQuestion.pregunta}</h3>
                </div>
                <div className={styles["question-answers-container"]}>
                    {currentQuestion.respuestas.map((answer: any, index: number) => (
                        <div
                            className={styles["answer-container"]}
                            key={`${questionCounter}_${index}_answers`}
                        >
                            <input
                                type="radio"
                                className={styles["radio-style"]}
                                name={`radio-question-${questionCounter}`}
                                id={`radio-question-${questionCounter}-${index}`}
                                checked={selectedAnswer === index}
                                onChange={() => handleAnswerSelection(index)}
                            />
                            <label className={styles["question"]} htmlFor={`radio-question-${questionCounter}-${index}`}>{answer}</label>

                            {isQuestionChecked && (
                                index === currentQuestion.correcta ? (
                                    <div className={`${styles["correct-answer-icon-container"]} ${selectedAnswer === index ? styles["selected-answer"] : styles["not-selected-answer"]}`}>
                                        <i className="bi bi-check-lg"></i>
                                    </div>
                                ) : (
                                    <div className={`${styles["wrong-answer-icon-container"]} ${selectedAnswer === index ? styles["selected-answer"] : styles["not-selected-answer"]}`}>
                                        <i className="bi bi-x"></i>
                                    </div>
                                )
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles["button-container"]}>
                    {isQuestionChecked ? (
                        <>
                            {questionCounter === questions.length - 1 ? (
                                <button onClick={() => {
                                    finishModulePractice(currentQuestion.pregunta, selectedAnswer);
                                }}>Finalizar  Prueba</button>
                            ) : (
                                <button onClick={() => saveQuestionAnswer(currentQuestion.pregunta, selectedAnswer)}>Siguiente Pregunta</button>)
                            }
                        </>
                    ) : (
                        <button onClick={checkQuestion} disabled={selectedAnswer === null}>Comprobar</button>
                    )}
                </div>
            </div>
        </div>
    )
};

export default CurrentQuestion;