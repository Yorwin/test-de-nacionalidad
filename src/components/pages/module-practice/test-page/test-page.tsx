"use client"

import React, { useEffect, useState } from "react";
import styles from "@/styles/layout/practica-por-modulo/test-page.module.scss";
import Header from "@/components/pages/module-practice/test-page/header-test";
import LeaveTest from "@/components/pages/module-practice/test-page/leave-test-confirmation"
import TestResultsPage from "@/components/pages/module-practice/test-page/test-result-page";
import CurrentQuestion from "@/components/pages/module-practice/test-page/current-question";
import { saveModulePractice } from "@/firebase/firebase";
import { auth, db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { QAEntry, questionType, saveQuestionAnswerLocally, saveAnswersInServer, saveQuestionsInServer } from "@/types/types";

interface TestPageProps {
    toggleModulePractice: () => void;
    moduleNumber: number;
}

const TestPage = ({ toggleModulePractice, moduleNumber }: TestPageProps) => {

    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuario no autenticado");
    }

    //useStates

    const [isQuestionChecked, setIsQuestionChecked] = useState(false);
    const [loading, setIsLoading] = useState(true);

    const [questions, setQuestions] = useState<questionType[]>([]);
    const [totalAmountOfQuestions, setTotalAmountOfQuestions] = useState(0);
    const [userWantsToLeave, setUserWantsToLeave] = useState(false)
    const [questionCounter, setQuestionCounter] = useState<number>(
        () => Number(sessionStorage.getItem('current_question')) || 0
    );
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showTestResults, setShowTestResults] = useState(false);
    const [arrayQuestionsAndAnswers, setArrayQuestionsAndAnswers] = useState<QAEntry[]>([]);

    //Results Id
    const [resultId, setResultId] = useState<string | null>(null);

    //SALIR DE LA PRACTICA.

    const toggleLeaveTestMessage = () => {
        setUserWantsToLeave(e => !e);
    };

    const goBackToHome = () => {

        const keys = [];

        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key) { // Verificamos que key no sea null
                keys.push(key);
            }
        }

        // Ahora elimina los items usando las keys guardadas
        keys.forEach(key => {
            sessionStorage.removeItem(key);
        });

        toggleModulePractice();
    };

    //REVISAR PREGUNTA.

    const checkQuestion = () => {
        setIsQuestionChecked(e => !e);
    }

    //MANEJAR SELECCIÓN DE PREGUNTA

    const handleAnswerSelection = (index: number) => {
        setSelectedAnswer(index);
    };

    // LOGICA PARA GUARDAR LOS RESULTADOS CORRESPONDIENTES AL MODULO.

    //Calcular respuestas.
    const calculateModulePracticeScore = async () => {
        const storedAnswers = sessionStorage.getItem("respuestas");
        let score = 0;

        if (!storedAnswers) {
            console.log("No se encontraron respuestas en sessionStorage");
            return 0;
        }

        const userAnswers = JSON.parse(storedAnswers);

        userAnswers.forEach((userAnswerObj: Record<string, number>) => {
            const [questionText, selectedAnswerIndex] = Object.entries(userAnswerObj)[0];

            const questionMatch = questions.find(q => q.pregunta === questionText);

            if (questionMatch && questionMatch.correcta === selectedAnswerIndex) {
                score += 1;
            }
        });

        return score;
    };

    //GUARDAR LAS PREGUNTAS EN EL SERVIDOR.
    const saveQuestionsInServer: saveQuestionsInServer = async (testId, score, answers) => {

        let moduleNumber: string | null;

        if (sessionStorage.getItem("module") != null) {
            moduleNumber = sessionStorage.getItem("module");
        } else {
            throw new Error("No fue posible localizar el número del modulo");
        }

        const modulePractice: string = await saveModulePractice(testId, score, answers, moduleNumber);
        setResultId(modulePractice);
    };

    //GUARDAR LA PREGUNTA LOCALMENTE.

    //Función para guardar array en memoria.
    const saveQuestionInMemory = (value: any) => {
        sessionStorage.setItem("respuestas", `${JSON.stringify(value)}`);
    };

    //Función para guardar en caso de recarga.
    const saveQuestionInCaseOfReload = (questions: any) => {
        sessionStorage.setItem("questions", JSON.stringify(questions));
    };

    //Guardar la pregunta en formato de Array en Session Storage.
    const saveQuestionAnswer: saveQuestionAnswerLocally = (key, value) => {

        if (value === null) {
            return value = "Pregunta no respondida"
        }

        const newEntry = {
            [key]: value,
        };

        const updatedArray = [...arrayQuestionsAndAnswers, newEntry];
        setArrayQuestionsAndAnswers(updatedArray);

        if (questionCounter + 1 !== totalAmountOfQuestions) {

            setQuestionCounter((e: number) => {
                const currentQuestion = e + 1;
                sessionStorage.setItem("current_question", `${currentQuestion}`);
                return e + 1;
            })

            checkQuestion();
            setSelectedAnswer(null);
        }

        saveQuestionInMemory(updatedArray);
    };

    //OBTENER PREGUNTAS RESPONDIDAS LOCALMENTE.

    const getAnsweredQuestions = () => {
        const storedAnswers = sessionStorage.getItem("respuestas");
        let answers;

        if (storedAnswers !== null) {
            answers = JSON.parse(storedAnswers);
        } else {
            console.warn("No se encontraron respuestas en sessionStorage");
        }

        return answers;
    };

    //FINALIZAR PRÁCTICA DEL MODULO Y GUARDAR EN EL SERVIDOR LAS RESPUESTAS.
    const finishModulePractice: saveAnswersInServer = async (lastQuestion, lastAnswer) => {
        try {
            saveQuestionAnswer(lastQuestion, lastAnswer);

            const score = await calculateModulePracticeScore();
            const answers = getAnsweredQuestions();

            saveQuestionsInServer("module-practice", score, answers);

            setShowTestResults(true);
        } catch (error) {
            console.error("Error al guardar las preguntas" + error);
        }
    };

    //FUNCION PARA OBTENER LAS PREGUNTAS DE CADA MÓDULO.
    const getModuleQuestions = async () => {
        try {
            setIsLoading(true);
            const savedQuestionsStr = sessionStorage.getItem("questions");

            if (savedQuestionsStr) {
                const savedQuestions = JSON.parse(savedQuestionsStr);
                setQuestions(savedQuestions);
                setTotalAmountOfQuestions(savedQuestions.length);
                setIsLoading(false);
                return;
            }

            const moduleQuestions: questionType[] = [];

            const questionsInModuleRef = collection(db, "preguntas", `Modulo_${moduleNumber}`, "preguntas");
            const questionsSnap = await getDocs(questionsInModuleRef);

            questionsSnap.forEach((doc) => {
                const data = doc.data();

                const dataInCorrectFormat = {
                    correcta: data.correcta,
                    pregunta: data.pregunta,
                    respuestas: data.respuestas,
                }

                moduleQuestions.push(dataInCorrectFormat);
            });

            setQuestions(moduleQuestions);
            saveQuestionInCaseOfReload(moduleQuestions);
            setTotalAmountOfQuestions(moduleQuestions.length);
        } catch (error) {
            console.error(`Error al intentar obtener las preguntas: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getModuleQuestions();
    }, [moduleNumber]);

    return (
        <div className={styles["main-container-test"]}>
            {showTestResults && resultId != null ? (
                <TestResultsPage goBackToHome={goBackToHome} resultId={resultId} />
            ) : (
                <>
                    {userWantsToLeave && (
                        <LeaveTest
                            leaveTest={goBackToHome}
                            toggleLeaveTestMessage={toggleLeaveTestMessage}
                        />
                    )}

                    <div className={styles["header-container"]}>
                        <Header
                            totalAmountOfQuestions={totalAmountOfQuestions}
                            moduleSelected={moduleNumber}
                            toggleLeaveTestMessage={toggleLeaveTestMessage}
                            currentQuestion={questionCounter}
                        />
                    </div>

                    <CurrentQuestion
                        loading={loading}
                        questions={questions}
                        questionCounter={questionCounter}
                        selectedAnswer={selectedAnswer}
                        handleAnswerSelection={handleAnswerSelection}
                        finishModulePractice={finishModulePractice}
                        saveQuestionAnswer={saveQuestionAnswer}
                        isQuestionChecked={isQuestionChecked}
                        checkQuestion={checkQuestion} />
                </>
            )}
        </div>
    );

};

export default TestPage;