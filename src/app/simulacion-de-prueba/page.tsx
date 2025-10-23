"use client"

import React, { useCallback, useEffect, useState } from "react";
import ExitTestIcon from "@/components/exit-test-icon";
import Counter from "@/components/pages/test-simulation/counter-test-simulation";
import { CounterProvider } from "@/context/counter-simulacion-prueba";
import TaskControl from "@/components/task-counter";
import ProgressBar from "@/components/pages/test-simulation/progress-bar";
import ArrowGoBack from "@/components/arrow-go-back";
import QuestionGenerator from "@/components/pages/test-simulation/question-generator";
import FinishTestMessage from "@/components/pages/test-simulation/finish-test-message";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import CheckTestSimulation from "@/components/pages/test-simulation/check-test-simulation";
import TestResults from "@/components/pages/test-simulation/test-results";
import { saveResultsTest } from "@/firebase/firebase";
import styles from "@/styles/layout/simulacion-de-prueba/test-simulation.module.scss";
import ControlSimulationButtons from "@/components/pages/test-simulation/control-simulation-buttons";
import LoadingScreen from "@/components/loading-screen";

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

interface verifiedAnswersBeforeResults {
    [code: string]: number;
}

type PreguntaData = {
    correcta: number;
    [key: string]: any;
};

const TestSimulation = () => {

    //Evaluar Simulación.

    const [showTestSimulation, setShowTestSimulation] = useState(true);
    const [showResultsTest, setShowResultsTest] = useState(false);
    const [showCheckTestMessage, setShowCheckTestMessage] = useState(false);
    const [results, setResults] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [saving, setSaving] = useState(false);

    const handleShowCheckTestMessage = () => {
        setShowCheckTestMessage(current => !current)
    }

    const showResults = async () => {

        setSaving(true);
        setShowCheckTestMessage(current => !current)
        setShowTestSimulation(current => !current)

        try {
            const resultsTest = await verificarRespuestas();
            await saveResultsTest(resultsTest);
            setSaving(false);
        } catch (error) {
            console.error("Error al guardar el test", error);
        } finally {
            setSaving(false);
            setShowResultsTest(current => !current)
        }
    };

    const getQuestionData = async (
        Id_pregunta: string,
        modulo: string
    ): Promise<(PreguntaData & { id: string }) | null> => {
        const docRef = doc(db, "preguntas", modulo, "preguntas", Id_pregunta);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() as PreguntaData };
        } else {
            console.log("No se encontró la pregunta.");
            return null;
        }
    };

    const verificarRespuestas = async () => {

        //Configurar testId
        let testId = "test_simulation";

        //Sumar total
        let total = modulosData.reduce((sum, item) => sum + item.quantity, 0);

        //Obtener duración.
        let getDuration = Number(sessionStorage.getItem("cronometro"));

        //Obtener puntaje.
        let score = 0;

        //Obtener preguntas. 

        let arrayAllQuestions: any[] = [];

        for (let i = 1; i <= 5; i++) {
            const gottenItem = sessionStorage.getItem(`questions-module-Modulo_${i}`);
            const convertedItem = gottenItem ? JSON.parse(gottenItem) : null;

            if (convertedItem) {
                arrayAllQuestions.push(convertedItem);
            }
        }

        //Obtener respuestas

        let arrayAllAnswers: verifiedAnswersBeforeResults[] = [];

        for (let i = 1; i <= 5; i++) {
            const gottenItem = sessionStorage.getItem(`answers-module-Modulo_${i}`);
            const convertedItem = gottenItem ? JSON.parse(gottenItem) : null;

            if (convertedItem) {
                arrayAllAnswers.push(convertedItem);
            }
        }

        for (let index = 0; index < arrayAllAnswers.length; index++) {
            const respuestasModulo = arrayAllAnswers[index];
            const modulo = `Modulo_${index + 1}`;
            const preguntas = Object.entries(respuestasModulo); // [ [idPregunta, respuesta], ... ]

            for (const [idPregunta, respuesta] of preguntas) {
                const questionInfo = await getQuestionData(idPregunta, modulo);
                const isCorrect = questionInfo?.correcta === respuesta;
                if (isCorrect) score++;
            }
        }

        setResults(score);
        setTotalQuestions(total);

        return {
            testId,
            score: score,
            answers: arrayAllAnswers,
            duration: getDuration,
            questions: arrayAllQuestions,
        }
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
        <CounterProvider>
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