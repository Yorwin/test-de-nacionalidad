"use client"

import React, { useEffect, useState } from "react";
import styles from "@/styles/layout/results/results.module.scss";

interface Questions {
    id?: string,
    pregunta?: string,
    respuestas?: string[],
    correcta?: number,
}

interface ModulesMap {
    [key: string]: Questions[]; // Cada módulo contiene un array de preguntas
}

interface answers {
    [key: string]: number;
}

interface SimulationResultQuestionsProps {
    questionData: ModulesMap;
    currentModule: number;
    answers: answers[];
}

const SimulationResultQuestions = ({ questionData, currentModule, answers }: SimulationResultQuestionsProps) => {

    const [moduleToBeShown, setModuleToBeShown] = useState<React.ReactElement>(<></>);

    const renderQuestionList = (moduleQuestions: Questions[]) => {

        //Recibimos las respuestas y las sacamos del array para manejarlas más facilmente. 
        const answeredQuestions = answers[0] || {};

        //Devolvemos un nuevo array con los elementos JSX aplicando la lógica correspondiente.
        return moduleQuestions.map((question: Questions, index: number) => {

            if (!question.id) {
                throw new Error("Error al intentar obtener la pregunta");
            }

            //Obtenemos el array con las respuestas y el identificador de la pregunta.
            const respuestas = question.respuestas || [];
            const questionId = question.id;

            // Verificar si la pregunta fue respondida
            let respondida: boolean = false;
            let userAnswer: number | null = null;

            if (questionId in answeredQuestions) {
                respondida = true;
                userAnswer = answeredQuestions[questionId];
            }

            // Determinar el estado de la pregunta
            const isCorrect = respondida && (question.correcta === userAnswer);
            const isIncorrect = respondida && !isCorrect;
            const notAnswered = !respondida;

            return (
                /* creamos un li element */
                <li key={index} className={notAnswered ? styles["not-answered"] : ""}>
                    <p className={styles["question-parragraph"]}>
                        <small className={styles["question-number"]}>{index + 1}</small>
                        {question.pregunta}
                        {notAnswered && <span className={styles["not-answered-label"]}> (No respondida)</span>}
                        {isCorrect && <span className={styles["correct-label"]}> (Correcta)</span>}
                        {isIncorrect && <span className={styles["incorrect-label"]}> (Incorrecta)</span>}
                    </p>

                    {/* Renderizar cada opción de respuesta */}
                    {respuestas.map((respuesta: string, respIndex: number) => {

                        // Determinar el estilo de cada opción
                        let optionClassName = styles["question-option"];
                        let iconClassName = "";

                        if (respondida) {
                            const isCorrectOption = respIndex === question.correcta;
                            const isSelectedOption = respIndex === userAnswer;

                            if (isCorrectOption && isSelectedOption) {
                                // Es la opción correcta Y fue seleccionada por el usuario
                                optionClassName = `${optionClassName} ${styles["question-option-right"]}`;
                                iconClassName = "bi bi-check-lg";
                            } else if (isCorrectOption) {
                                // Es la opción correcta pero NO fue seleccionada
                                optionClassName = `${optionClassName} ${styles["question-option-right-but-not-selected"]}`;
                                iconClassName = "bi bi-check-lg";
                            } else if (isSelectedOption) {
                                // No es la correcta pero fue seleccionada (respuesta incorrecta)
                                optionClassName = `${optionClassName} ${styles["question-option-wrong"]}`;
                                iconClassName = "bi bi-x";
                            } else {
                                // No es correcta ni fue seleccionada
                                optionClassName = `${optionClassName} ${styles["question-option-not-selected"]}`;
                                iconClassName = styles["not-selected-option"];
                            }
                        }

                        else {
                            // Si no está respondida, marcamos la opción correcta con un estilo especial
                            const isCorrectOption = respIndex === question.correcta;

                            if (isCorrectOption) {
                                optionClassName = `${optionClassName} ${styles["question-option-right-not-selected"]}`;
                                iconClassName = "bi bi-check-lg";
                            } else {
                                optionClassName = `${optionClassName} ${styles["question-option-not-selected"]}`;
                                iconClassName = styles["not-selected-option"];
                            }
                        }

                        return (
                            <div key={respIndex} className={optionClassName}>
                                <i className={iconClassName}></i>
                                <p className={styles["text-option"]}>{respuesta || 'Sin respuesta'}</p>
                            </div>
                        );
                    })}
                </li>
            );
        });
    };

    const modulesList = [
        renderQuestionList(questionData.module1),
        renderQuestionList(questionData.module2),
        renderQuestionList(questionData.module3),
        renderQuestionList(questionData.module4),
        renderQuestionList(questionData.module5)
    ];

    useEffect(() => {
        if (currentModule >= 0) {
            setModuleToBeShown(<>{modulesList[currentModule]}</>);
        }
    }, [currentModule]);

    return (
        <ul className={styles["question-list"]}>
            {moduleToBeShown}
        </ul>
    )
};

export default SimulationResultQuestions;