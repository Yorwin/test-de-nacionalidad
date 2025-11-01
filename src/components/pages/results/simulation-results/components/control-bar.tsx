import styles from "@/styles/layout/results/results.module.scss";

interface answers {
    [key: string]: number;
}

interface Questions {
    id?: string,
    pregunta?: string,
    respuestas?: string[],
    correcta?: number,
}

interface ModulesMap {
    [key: string]: Questions[]; // Cada módulo contiene un array de preguntas
}

interface ControlBarProps {
    currentModule: number;
    questionData: ModulesMap;
    answers: answers[];
}

const ControlBar = ({ answers, questionData, currentModule }: ControlBarProps) => {

    // Obtener el módulo actual según el índice
    const getModuleKey = (): string => {
        return `module${currentModule + 1}`;
    };

    // Obtener las preguntas del módulo actual
    const getCurrentQuestions = (): Questions[] => {
        const moduleKey = getModuleKey();
        return questionData[moduleKey] || [];
    };

    // Verificar si una pregunta está contestada correctamente
    const isQuestionCorrect = (question: Questions): boolean => {
        if (!question.id) {
            return false;
        }

        const answeredQuestions = answers[currentModule] || {};

        // Buscar directamente la respuesta del usuario para esta pregunta
        const userAnswer = answeredQuestions[question.id];

        // Si no hay respuesta registrada para esta pregunta
        if (userAnswer === undefined) {
            return false;
        }

        // Ahora sí, comparamos la respuesta dada con la correcta
        return userAnswer === question.correcta;
    };

    // Renderizar los indicadores para cada pregunta
    const renderQuestionIndicators = () => {
        const questions = getCurrentQuestions();

        return questions.map((question, index) => {
            const isCorrect = isQuestionCorrect(question);

            return (
                <div
                    key={index}
                    className={isCorrect ? styles["right-item"] : styles["wrong-item"]}
                    title={`Pregunta ${index + 1}`}
                >
                    <i className={isCorrect ? "bi bi-check-lg" : "bi bi-x"}></i>
                </div>
            );
        });
    };

    return (
        <div className={styles["questions-control-bar"]}>
            {renderQuestionIndicators()}
        </div>
    );
};

export default ControlBar;