import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import styles from "@/styles/layout/simulacion-de-prueba/question-generator.module.scss";

type Pregunta = {
    id: string;
    pregunta: string;
    respuestas: string[];
    correcta: number;
};

type UserAnswerType = {
    [key: string]: number;
}

type QuestionGeneratorProps = {
    quantity: number;
    module: string;
    initialQuestions?: Pregunta[];
    initialUserAnswers?: UserAnswerType;
    onQuestionsLoaded?: (questions: Pregunta[]) => void;
    onUserAnswersChange?: (userAnswers: UserAnswerType) => void;
};

const QuestionGeneratorComponent = ({
    quantity,
    module,
    initialQuestions = [],
    initialUserAnswers = {},
    onQuestionsLoaded,
    onUserAnswersChange }: QuestionGeneratorProps) => {

    const [questions, setQuestions] = useState<Pregunta[]>([]);
    const [userAnswer, setUserAnswer] = useState<UserAnswerType>(initialUserAnswers || {});

    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const shuffleAndSelectQuestions = (questions: Pregunta[], quantity: number) => {
        return [...questions]
            .sort(() => 0.5 - Math.random())
            .slice(0, quantity);
    };

    const obtainRandomQuestions = useMemo(() => shuffleAndSelectQuestions, []);

    useEffect(() => {
        const savedAnswers = sessionStorage.getItem(`answers-module-${module}`);

        if (savedAnswers) {
            setUserAnswer(JSON.parse(savedAnswers));
        } else {
            setUserAnswer(initialUserAnswers || {});
        }

    }, [module, initialUserAnswers]);

    useEffect(() => {

        const loadQuestions = async () => {

            if (sessionStorage.getItem(`questions-module-${module}`)) {
                let savedQuestions = sessionStorage.getItem(`questions-module-${module}`);

                if (savedQuestions) {
                    const parsedQuestions = JSON.parse(savedQuestions) as Pregunta[];
                    setQuestions(parsedQuestions);
                }

                setLoading(false);
                return;
            }

            if (initialQuestions.length > 0) {
                setQuestions(initialQuestions);
                setUserAnswer(initialUserAnswers);
                return;
            }

            setLoading(true);

            try {
                const preguntasRef = collection(db, "preguntas", module, "preguntas");
                const querySnapShot = await getDocs(preguntasRef);

                if (querySnapShot.empty) {
                    console.log("No se encontraron preguntas en Firestore para este módulo.");
                    setQuestions([]);
                    setLoading(false);
                    return;
                }

                const todasLasPreguntas: Pregunta[] = querySnapShot.docs.map((doc) => {
                    const data = doc.data();

                    if (!data.pregunta) console.warn(`Missing QUESTIONS in doc ${doc.id}`);
                    if (!Array.isArray(data.respuestas)) console.warn(`Invalid ANSWERS in doc ${doc.id}`);
                    if (typeof data.correcta !== 'number') console.warn(`Invalid CORRECT ANSWER in doc ${doc.id}`);

                    return {
                        id: doc.id,
                        pregunta: data.pregunta,
                        respuestas: data.respuestas,
                        correcta: data.correcta,
                    };
                });

                let randomQuestions = obtainRandomQuestions(todasLasPreguntas, quantity);

                setQuestions(() => {
                    return [...randomQuestions] as Pregunta[]
                });

                if (onQuestionsLoaded) {
                    sessionStorage.setItem(`questions-module-${module}`, JSON.stringify(randomQuestions));
                    onQuestionsLoaded(randomQuestions);
                }

            } catch (error) {
                console.error("Error cargando las preguntas:", error);
                setError("Error al cargar las preguntas. Por favor, inténtelo de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();

    }, [module, quantity, initialQuestions.length]);

    const handleAnswerChange = (questionId: string, answerIndex: number) => {

        const newUserAnswers = {
            ...userAnswer,
            [questionId]: answerIndex,
        };

        setUserAnswer(newUserAnswers);

        if (module.charAt(module.length - 1) === questionId.charAt(questionId.length - 1)) {

            const savedAnswers = sessionStorage.getItem(`answers-module-${module}`);
            const parsedAnswers = savedAnswers ? JSON.parse(savedAnswers) : {};

            const updatedAnswers = {
                ...parsedAnswers,
                [questionId]: answerIndex
            };

            sessionStorage.setItem(`answers-module-${module}`, JSON.stringify(updatedAnswers));
        }

        if (onUserAnswersChange) {
            onUserAnswersChange(newUserAnswers);
        }
    };

    const handleResult = () => {
        let correct = 0;

        questions.forEach((question) => {
            if (userAnswer[question.id] === question.correcta) {
                correct++
            }
        });

        setResult(correct);
    };

    if (loading) {
        return <div className={styles["loading"]}>Cargando preguntas...</div>;
    }

    if (error) {
        return <div className={styles["error"]}>{error}</div>;
    }

    return <>
        <div className={styles["question-generator-main-container"]}>
            <div className={styles["question-container"]}>
                {questions.length > 0 ? (
                    questions.map((question) => (
                        <div key={question.id}>
                            <div className={styles["container-header"]}>
                                <i className="bi bi-arrow-right"></i>
                                <h3>{question.pregunta}</h3>
                            </div>

                            <div className={styles["container-answers"]}>
                                {question.respuestas.map((respuesta, index) => (
                                    <div key={index}>
                                        <input
                                            type="radio"
                                            className={styles["radio-style"]}
                                            name={`checkbox-${question.id}-${index}`}
                                            id={`checkbox-${question.id}-${index}`}
                                            onChange={() => handleAnswerChange(question.id, index)}
                                            checked={userAnswer?.[question.id] === index} />
                                        <label htmlFor={`checkbox-${question.id}-${index}`}>{respuesta}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay preguntas disponibles.</p>
                )}
            </div>
        </div>
    </>
};

const QuestionGenerator = React.memo(QuestionGeneratorComponent);

export default QuestionGenerator;