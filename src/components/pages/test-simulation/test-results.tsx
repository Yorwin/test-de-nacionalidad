import { useEffect, useState } from "react";
import styles from "@/styles/layout/simulacion-de-prueba/check-test-simulation.module.scss";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const TestResults = ({ results, total }: { results: number, total: number }) => {

    const { user } = useAuth();

    if (!user) {
        throw new Error("No se ha logrado encontrar al usuario autenticado");
    }

    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const goHome = () => {
        sessionStorage.clear();
        router.push("/");
    };

    useEffect(() => {
        const calculateAndStoreExperience = async (): Promise<void> => {
            try {
                // Paso 1: Obtener todos los resultados
                const resultsRef = collection(db, `users/${user.uid}/resultados`);
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
                const userRef = doc(db, `users/${user.uid}`);
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
            } finally {
                setLoading(false);
            }
        };

        calculateAndStoreExperience();
    }, [user]);

    if (loading) {
        return (
            <div className={styles["test-results-main-container"]}>
                <h2>Cargando resultados...</h2>
            </div>
        )
    }

    return (
        <div className={styles["test-results-main-container"]}>
            <h2>Resultados Test</h2>
            <div className={styles["results-data-container"]}>
                <p>Cantidad de aciertos: {results}</p>
                <p>Cantidad de fallos: {total - results}</p>
            </div>
            <div className={styles["go-home-button"]}>
                <button onClick={goHome}>
                    <i className="bi bi-house-door"></i>
                    <small>Volver al Home</small>
                </button>
            </div>
        </div>
    )
};

export default TestResults;