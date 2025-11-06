"use client"

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/layout/simulacion-de-prueba/test-simulation.module.scss";

/* Components */
import ExitTestIcon from "@/components/exit-test-icon";
import Counter from "@/components/pages/test-simulation/counter-test-simulation";
import TaskControl from "@/components/task-counter";
import ProgressBar from "@/components/pages/test-simulation/progress-bar";
import ArrowGoBack from "@/components/arrow-go-back";
import QuestionGenerator from "@/components/pages/test-simulation/question-generator";
import FinishTestMessage from "@/components/pages/test-simulation/finish-test-message";
import CheckTestSimulation from "@/components/pages/test-simulation/check-test-simulation";
import TestResults from "@/components/pages/test-simulation/test-results";
import ControlSimulationButtons from "@/components/pages/test-simulation/control-simulation-buttons";
import LoadingScreen from "@/components/loading-screen";

/* Hooks */
import { useTestCompletion } from "@/functions/hooks/useTestCompletion";

/* Context */
import { CounterProvider } from "@/context/counter-simulacion-prueba";

type Pregunta = {
    id: string;
    pregunta: string;
    respuestas: string[];
    correcta: number;
};

type UserAnswerType = {
    [key: string]: number;
}

type ModuleQuestionState = {
    module: string;
    quantity: number;
    questions: Pregunta[];
    userAnswers: UserAnswerType;
}

const TestSimulation = () => {
    const { saving, results, totalQuestions, completeTest } = useTestCompletion();

    //Evaluar Simulación.

    const [showTestSimulation, setShowTestSimulation] = useState(true);
    const [showResultsTest, setShowResultsTest] = useState(false);
    const [showCheckTestMessage, setShowCheckTestMessage] = useState(false);

    const handleShowCheckTestMessage = () => {
        setShowCheckTestMessage(current => !current)
    }

    const showResults = () => {
        completeTest(() => {
            setShowResultsTest(true);
        }, () => {
            setShowCheckTestMessage(false);
            setShowTestSimulation(false);
        }
        );
    };

    //Salir de Simulacion.

    const [showConfirmMessage, setShowConfirmMessage] = useState(false);
    const [displayContenedorSimulacion, setDisplayContenedorSimulacion] = useState("visible");
    const router = useRouter();

    const handleConfirmMessage = () => {
        setShowConfirmMessage(current => !current);
    }

    const handleExitSimulation = () => {
        sessionStorage.clear();
        router.push("/")
    }

    useEffect(() => {
        setDisplayContenedorSimulacion(showConfirmMessage || showCheckTestMessage || showResultsTest === true ? "hidden" : "visible");
    }, [showConfirmMessage, showCheckTestMessage, showResultsTest])

    //Preguntas

    const modulosData = [
        { module: "Modulo_1", quantity: 10 },
        { module: "Modulo_2", quantity: 3 },
        { module: "Modulo_3", quantity: 2 },
        { module: "Modulo_4", quantity: 3 },
        { module: "Modulo_5", quantity: 7 },
    ];

    const [moduleQuestionStates, setModuleQuestionStates] = useState<ModuleQuestionState[]>(
        modulosData.map(({ module, quantity }) => ({
            module,
            quantity,
            questions: [],
            userAnswers: {}
        }))
    )

    const [moduleToBeShown, setModuleToBeShown] = useState(0);

    useEffect(() => {
        const savedCurrentModule = sessionStorage.getItem("currentModule");
        if (savedCurrentModule) {
            setModuleToBeShown(Number(savedCurrentModule));
        }
    }, []);

    const [buttonState, setButtonState] = useState(false);
    const [goBackArrowState, setGoBackArrowState] = useState(true);
    const [answeredQuestionsByModule, setAnsweredQuestionsByModule] = useState(
        modulosData.map(() => 0)
    );

    const updateModuleQuestions = useCallback((moduleIndex: number, questions: Pregunta[]) => {
        setModuleQuestionStates(prev =>
            prev.map((moduleState, index) =>
                index === moduleIndex ? { ...moduleState, questions }
                    : moduleState
            )
        )
    }, []);

    const updateModuleAnswers = useCallback((moduleIndex: number, userAnswers: UserAnswerType) => {
        setModuleQuestionStates((prev) => {
            return prev.map((moduleState, index) =>
                index === moduleIndex ? { ...moduleState, userAnswers }
                    : moduleState
            )
        }
        )

        setAnsweredQuestionsByModule(prev => {
            const newState = [...prev];
            newState[moduleIndex] = Object.keys(userAnswers).length;
            return newState
        });
    }, []);

    const handleNextModule = () => {
        if (moduleToBeShown < 4) {
            setModuleToBeShown(currentValue => currentValue + 1);
        }
    };

    const handleGoBack = () => {
        if (moduleToBeShown !== 0) {
            setModuleToBeShown(currentValue => currentValue - 1);
        }
    };

    useEffect(() => {

        if (moduleToBeShown > 0) {
            setGoBackArrowState(false);
        } else if (moduleToBeShown === 0) {
            setGoBackArrowState(true);
        }

        if (moduleToBeShown < 4) {
            setButtonState(false);
        } else if (moduleToBeShown === 4) {
            setButtonState(true)
        }

    }, [moduleToBeShown])

    const renderQuestionGenerator = useCallback(() => {
        const currentModuleState = moduleQuestionStates[moduleToBeShown];
        sessionStorage.setItem('currentModule', `${moduleToBeShown}`);

        return (
            <QuestionGenerator
                module={currentModuleState.module}
                quantity={currentModuleState.quantity}
                initialQuestions={currentModuleState.questions}
                initialUserAnswers={currentModuleState.userAnswers}
                onQuestionsLoaded={(questions) => updateModuleQuestions(moduleToBeShown, questions)}
                onUserAnswersChange={(userAnswers) => updateModuleAnswers(moduleToBeShown, userAnswers)}
            />
        );
    }, [moduleToBeShown, moduleQuestionStates, updateModuleQuestions, updateModuleAnswers]);

    const savedAnswers = sessionStorage.getItem(`answers-module-${modulosData[moduleToBeShown].module}`);
    const totalQuestionsInModule = modulosData[moduleToBeShown].quantity;
    const answeredInCurrentModule = savedAnswers ? Object.keys(JSON.parse(savedAnswers)).length : answeredQuestionsByModule[moduleToBeShown];
    const progressPercentage = (answeredInCurrentModule / totalQuestionsInModule) * 100;

    return <>
        <CounterProvider onTimeUp={showResults}>
            {saving ? <LoadingScreen /> : null}
            {showResultsTest ? <TestResults results={results} total={totalQuestions} /> : null}

            {showTestSimulation ? <div className={styles["main-container-test-simulation"]} style={{ overflow: `${displayContenedorSimulacion}` }}>

                {showConfirmMessage ? <FinishTestMessage cancelExitSimulation={handleConfirmMessage} continueExitSimulation={handleExitSimulation} /> : null}
                {showCheckTestMessage ? <CheckTestSimulation cancelShowCheckTestMessage={handleShowCheckTestMessage} showResults={showResults} /> : null}

                <div className={styles["container-header-element"]}>
                    <div className={styles["header-styler-container"]}>
                        <div className={styles["container-control-elements"]}>
                            <ExitTestIcon showConfirmMessage={handleConfirmMessage} />
                            <Counter />
                            <TaskControl taskCounter={moduleToBeShown} />
                        </div>
                        <div>
                            <ProgressBar progress={`${progressPercentage + "%"}`} />
                            <button onClick={handleGoBack} disabled={goBackArrowState} className={styles["button-last-module"]}>
                                {goBackArrowState ? <i className="bi bi-arrow-left"></i> : <ArrowGoBack />}
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles["questions-container"]}>
                    {renderQuestionGenerator()}
                </div>
                <div className={styles["control-simulation-buttons-container"]}>
                    <ControlSimulationButtons nextModule={handleNextModule} showCheckTest={handleShowCheckTestMessage} buttonState={buttonState} />
                </div>
            </div> : null}


        </CounterProvider>
    </>
};

export default TestSimulation;