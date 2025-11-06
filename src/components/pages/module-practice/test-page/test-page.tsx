"use client"

import React, { useEffect, useState } from "react";
import styles from "@/styles/layout/practica-por-modulo/test-page.module.scss";
import Header from "@/components/pages/module-practice/test-page/header-test";
import LeaveTest from "@/components/pages/module-practice/test-page/leave-test-confirmation"
import TestResultsPage from "@/components/pages/module-practice/test-page/test-result-page";
import CurrentQuestion from "@/components/pages/module-practice/test-page/current-question";
import { saveModulePractice } from "@/firebase/firebase";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { QAEntry, questionType, saveQuestionAnswerLocally, saveAnswersInServer, saveQuestionsInServer, verifiedAnswersBeforeResults } from "@/types/types";

interface TestPageProps {
    toggleModulePractice: () => void;
    moduleNumber: number;
}

const TestPage = ({ toggleModulePractice, moduleNumber }: TestPageProps) => {

    //useStates

    const [isQuestionChecked, setIsQuestionChecked] = useState(false);
    const [loading, setIsLoading] = useState(true);

    const [questions, setQuestions] = useState<questionType[]>([]);
    const [totalAmountOfQuestions, setTotalAmountOfQuestions] = useState(0);
    const [userWantsToLeave, setUserWantsToLeave] = useState(false)
    const [questionCounter, setQuestionCounter] = useState<number>(0);
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
        let score = 0;

        arrayQuestionsAndAnswers.forEach((userAnswerObj) => {
            const [questionText, selectedAnswerIndex] = Object.entries(userAnswerObj)[0];

            const questionMatch = questions.find(q => q.pregunta === questionText);

            if (questionMatch && typeof selectedAnswerIndex === 'number' && questionMatch.correcta === selectedAnswerIndex) {
                score += 1;
            }
        });

        return score;
    };

    //GUARDAR LAS PREGUNTAS EN EL SERVIDOR.
    const saveQuestionsInServer: saveQuestionsInServer = async (testId, score, answers) => {
        const modulePractice: string = await saveModulePractice(testId, score, answers, moduleNumber.toString());
        setResultId(modulePractice);
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

            setQuestionCounter((e: number) => e + 1);

            checkQuestion();
            setSelectedAnswer(null);
        }
    };

    //FINALIZAR PRÁCTICA DEL MODULO Y GUARDAR EN EL SERVIDOR LAS RESPUESTAS.
    const finishModulePractice: saveAnswersInServer = async (lastQuestion, lastAnswer) => {
        try {
            saveQuestionAnswer(lastQuestion, lastAnswer);

            const score = await calculateModulePracticeScore();

            saveQuestionsInServer("module-practice", score, arrayQuestionsAndAnswers as verifiedAnswersBeforeResults[]);

            setShowTestResults(true);
        } catch (error) {
            console.error("Error al guardar las preguntas" + error);
        }
    };

    //FUNCION PARA OBTENER LAS PREGUNTAS DE CADA MÓDULO.
    const getModuleQuestions = async () => {
        try {
            setIsLoading(true);

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