import ExitTestIcon from "../../../exit-test-icon";
import QuestionsCounter from "@/components/pages/module-practice/test-page/questions-counter";
import styles from "@/styles/layout/practica-por-modulo/test-page.module.scss";

interface HeaderTestProps {
    totalAmountOfQuestions : number,
    moduleSelected : number,
    toggleLeaveTestMessage : () => void,
    currentQuestion : number,
}

const HeaderTest = ({ totalAmountOfQuestions, moduleSelected, toggleLeaveTestMessage, currentQuestion }: HeaderTestProps) => {
    return <>
        <ExitTestIcon showConfirmMessage={toggleLeaveTestMessage}></ExitTestIcon>
        <div className={styles["title-test"]}>
            <h1>PRÁCTICA MODULO {moduleSelected}</h1>
        </div>
        <div className={styles["question-counter"]}>
            <QuestionsCounter totalQuestions={totalAmountOfQuestions} currentQuestion={currentQuestion}  />
        </div>
    </>
}

export default HeaderTest;