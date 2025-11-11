import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, DocumentData, QuerySnapshot } from "firebase/firestore";
import { db, saveResultsTest } from "@/firebase/firebase";
import { useTest } from "@/context/test-context";

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

    const router = useRouter();
    const { moduleQuestionStates } = useTest();

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

    const verificarRespuestas = async (duration: number): Promise<TestResult> => {
        //Configurar testId
        let testId = "test_simulation";

        //Sumar total
        let total = modulosData.reduce((sum, item) => sum + item.quantity, 0);

        //Usar duración proporcionada
        let getDuration = duration;

        //Obtener puntaje.
        let score = 0;

        //Obtener preguntas y respuestas del contexto
        let arrayAllQuestions: any[] = [];
        let arrayAllAnswers: verifiedAnswersBeforeResults[] = [];

        moduleQuestionStates.forEach((moduleState) => {
            arrayAllQuestions.push(moduleState.questions);
            arrayAllAnswers.push(moduleState.userAnswers);
        });

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

    const calculateAndStoreExperience = async (userId: string): Promise<void> => {
        try {
            // Paso 1: Obtener todos los resultados
            const resultsRef = collection(db, `users/${userId}/resultados`);
            const resultsQuery = query(resultsRef, orderBy('Date', 'desc'));
            const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(resultsQuery);

            let totalXP: number = 0;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const isSimulation = data.testId === "test_simulation";
                const hasEnoughScore = typeof data.score === 'number' && data.score > 20;

                if (isSimulation && hasEnoughScore) {
                    totalXP += 15;
                }
            });

            // Paso 2: Referencia al perfil del usuario
            const userRef = doc(db, `users/${userId}`);
            const profileSnap = await getDoc(userRef);

            if (profileSnap.exists()) {
                // Si ya existe el perfil, actualizamos la experiencia
                await updateDoc(userRef, { experience: totalXP });
            } else {
                // Si no existe, lo creamos con la experiencia inicial
                await setDoc(userRef, { experience: totalXP });
            }

        } catch (err) {
            console.error("Error al calcular o guardar experiencia:", err);
        }
    };

    const completeTest = async (duration: number) => {
        setSaving(true);

        try {
            const resultsTest = await verificarRespuestas(duration);
            const saveTest = await saveResultsTest(resultsTest);
            await calculateAndStoreExperience(saveTest.userId);
            router.push(`simulacion-de-prueba/resultado/${saveTest.docRef}`);
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