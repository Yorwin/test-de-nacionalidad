"use client"

import styles from "@/styles/layout/results/graphic-test-made.module.scss";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { getDocs, collection } from "firebase/firestore";
import { secondstoDecimalHours } from "@/functions/functions";

/* Context */
import { useAuth } from "@/context/auth-context";

const GraphicHoursSimulated = () => {

    const { user, loading: authLoading } = useAuth();

    const [simulatedHours, setSimulatedHours] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getHoursData = async () => {

            if (!user) {
                return null;
            }

            try {
                const hoursSimulated: number[] = [];
                const resultsRef = collection(db, "users", user.uid, "resultados");
                const querySnapshot = await getDocs(resultsRef);
                const testTime = 1500;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();

                    if (data.testId === "test_simulation") {
                        const duration = data.duration;
                        hoursSimulated.push(duration);
                    }
                })

                let totalHours = 0;

                if (hoursSimulated.length > 0) {
                    const totalSeconds = hoursSimulated.reduce((acc, currentValue) => acc + currentValue, 0);
                    totalHours = Number(secondstoDecimalHours(totalSeconds));
                }

                setSimulatedHours(totalHours);
            } catch (error) {
                console.error(`Error al intentar obtener horas simuladas`);
            } finally {
                setLoading(false);
            }
        }

        getHoursData();
    }, [user]);

    if ((!user && authLoading) || loading) {
        return (
            <div className={styles["skeleton-standard-container"]}>
                <div className={`skeleton-rect ${styles["skeleton-standard"]}`}></div>
            </div>
        )
    }

    return <>
        <div className={styles["main-container-tests"]}>
            <div className={styles["container-icon"]}>
                <i className="bi bi-stopwatch-fill"></i>
            </div>
            <div className={styles["total-hours"]}>
                <h3 className={styles["amount-hours"]}>{simulatedHours}<small className={styles["text-hours"]}> horas </small></h3>
            </div>
            <p className={styles["parragraph-simulated-hours"]}>Total de horas <br /> simuladas</p>
        </div>
    </>
};

export default GraphicHoursSimulated;