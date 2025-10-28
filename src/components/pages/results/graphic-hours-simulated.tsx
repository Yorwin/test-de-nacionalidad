import styles from "../styles/graphic-test-made.module.css"
import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/firebase";
import { getDocs, collection } from "firebase/firestore";
import { secondstoDecimalHours } from "../../../functions/functions";

const GraphicHoursSimulated = () => {

    const [simulatedHours, setSimulatedHours] = useState('');

    const user = auth.currentUser;

    if (!user) {
        throw new Error('Usuario no autenticado');
    }

    const getHoursData = async () => {

        const hoursSimulated: number[] = [];
        const resultsRef = collection(db, "users", user.uid, "resultados");
        const querySnapshot = await getDocs(resultsRef);
        const testTime = 1500;

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (data.testId === "test_simulation") {
                const duration = data.duration;
                const timeUsed = testTime - duration;

                hoursSimulated.push(timeUsed);
            }
        })

        return hoursSimulated;
    }

    useEffect(() => {
        getHoursData()
            .then((e) => {
                if (e.length > 0) {
                    const totalHours = e.reduce((acc, currentValue) => acc + currentValue);
                    return totalHours
                } else {
                    return 0;
                }
            }).then((totalHours) => {
                const total = secondstoDecimalHours(totalHours);
                setSimulatedHours(total);
            });
    });

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