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
import ControlSimulationButtons from "@/components/pages/test-simulation/control-simulation-buttons";
import LoadingScreen from "@/components/loading-screen";

/* Hooks */
import { useTestCompletion } from "@/functions/hooks/useTestCompletion";

/* Context */
import { CounterProvider, useCounter } from "@/context/counter-simulacion-prueba";
import { AuthProvider } from "@/context/auth-context";
import { TestProvider, useTest } from "@/context/test-context";

const TestSimulationWithCounter = () => {
    const [clickedOnSave, setClickedOnSave] = useState(false);
    const { completeTest } = useTestCompletion();
    const { timeLeft } = useCounter();

    const showResults = () => {
        setClickedOnSave(true);
        // Calcular duración: tiempo total menos tiempo restante
        const totalTime = 25 * 60; // 25 minutos en segundos
        const duration = totalTime - timeLeft;
        completeTest(duration);
    };

    return (
        <TestSimulationContent clickedOnSave={clickedOnSave} setClickedOnSave={setClickedOnSave} showResults={showResults} />
    );
};

const TestSimulationContent = ({ clickedOnSave, showResults }: {
    clickedOnSave: boolean,
    setClickedOnSave: React.Dispatch<React.SetStateAction<boolean>>,
    showResults: () => void
}) => {

    const router = useRouter();
    const { moduleQuestionStates,
        moduleToBeShown,
        setModuleToBeShown,
        answeredQuestionsByModule,
        updateModuleQuestions,
        updateModuleAnswers,
        resetTest
    } = useTest();

    //Evaluar Simulación.

    const [showCheckTestMessage, setShowCheckTestMessage] = useState(false);

    const handleShowCheckTestMessage = () => {
        setShowCheckTestMessage(current => !current)
    }

    // showResults se pasa como prop desde TestSimulationWithCounter

    //Salir de Simulacion.

    const [showConfirmMessage, setShowConfirmMessage] = useState(false);
    const [displayContenedorSimulacion, setDisplayContenedorSimulacion] = useState("visible");

    const handleConfirmMessage = () => {
        setShowConfirmMessage(current => !current);
    }

    const handleExitSimulation = () => {
        resetTest();
        router.push("/")
    }

    useEffect(() => {
        setDisplayContenedorSimulacion(showConfirmMessage || showCheckTestMessage === true ? "hidden" : "visible");
    }, [showConfirmMessage, showCheckTestMessage])

    //Preguntas

    const modulosData = [
        { module: "Modulo_1", quantity: 10 },
        { module: "Modulo_2", quantity: 3 },
        { module: "Modulo_3", quantity: 2 },
        { module: "Modulo_4", quantity: 3 },
        { module: "Modulo_5", quantity: 7 },
    ];

    const [buttonState, setButtonState] = useState(false);
    const [goBackArrowState, setGoBackArrowState] = useState(true);

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

    const totalQuestionsInModule = modulosData[moduleToBeShown].quantity;
    const answeredInCurrentModule = answeredQuestionsByModule[moduleToBeShown];
    const progressPercentage = (answeredInCurrentModule / totalQuestionsInModule) * 100;

    return (
        <>
            {clickedOnSave ? <LoadingScreen /> : <div className={styles["main-container-test-simulation"]} style={{ overflow: `${displayContenedorSimulacion}` }}>

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
            </div>}
        </>
    )
};

const TestSimulation = () => {
    return (
        <TestProvider>
            <CounterProvider>
                <AuthProvider>
                    <TestSimulationWithCounter />
                </AuthProvider>
            </CounterProvider >
        </TestProvider>
    );
};

export default TestSimulation;