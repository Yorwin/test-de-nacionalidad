import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, saveResultsTest } from "@/firebase/firebase";

type TestResult = {
    testId: string;
    score: number;
    answers: any[];
    duration: number;
    questions: any[];
};

type PreguntaData = {
    correcta: number;
    [key: string]: any;
};

interface verifiedAnswersBeforeResults {
    [code: string]: number;
}

const modulosData = [
    { module: "Modulo_1", quantity: 10 },
    { module: "Modulo_2", quantity: 3 },
    { module: "Modulo_3", quantity: 2 },
    { module: "Modulo_4", quantity: 3 },
    { module: "Modulo_5", quantity: 7 },
];

export const useTestCompletion = () => {
    const [saving, setSaving] = useState(false);
    const [results, setResults] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

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

    const verificarRespuestas = async (): Promise<TestResult> => {
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

    const completeTest = async (
        onShowResults: (results: number, total: number) => void,
        onToggleUI: () => void
    ) => {
        setSaving(true);

        try {
            const resultsTest = await verificarRespuestas();
            await saveResultsTest(resultsTest);
            onToggleUI();
            onShowResults(resultsTest.score, resultsTest.questions.reduce((sum, module) => sum + module.length, 0));
        } catch (error) {
            console.error("Error al guardar el test", error);
        } finally {
            setSaving(false);
        }
    };

    return {
        saving,
        results,
        totalQuestions,
        completeTest
    };
};