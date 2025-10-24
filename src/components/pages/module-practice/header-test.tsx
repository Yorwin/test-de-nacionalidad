import ExitTestIcon from "../../../components/exit-test-icon";
import QuestionsCounter from "@/components/pages/module-practice/questions-counter";
import styles from "../styles/test-page.module.css"

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