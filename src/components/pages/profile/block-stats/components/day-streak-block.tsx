"use client"

import { useState, useEffect } from "react";
import styles from "@/styles/layout/profile/blockstats.module.scss";
import { collection, query, getDocs, orderBy, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from "@/firebase/firebase";

interface DayStreakProps {
    userId: string;
}

const DayStreak = ({ userId }: DayStreakProps) => {
    const [streak, setStreak] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const calculateStreak = async (): Promise<void> => {
            try {
                setLoading(true);

                // Referencia a la colección de resultados del usuario
                const resultsRef = collection(db, `users/${userId}/resultados`);

                // Consulta todos los resultados ordenados por fecha (más reciente primero)
                const resultsQuery = query(resultsRef, orderBy('Date', 'desc'));
                const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(resultsQuery);

                // Convierte los datos de Firestore y extrae las fechas
                const testDates: Date[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // Parsea la fecha en formato "D/M/YYYY" a objeto Date
                    if (data.Date && typeof data.Date === 'string') {
                        const dateParts: string[] = data.Date.split('/');
                        const parsedDate: Date = new Date(
                            parseInt(dateParts[2], 10), // Año
                            parseInt(dateParts[1], 10) - 1, // Mes (0-indexed)
                            parseInt(dateParts[0], 10) // Día
                        );
                        testDates.push(parsedDate);
                    }
                });

                if (testDates.length === 0) {
                    setStreak(0);
                    setLoading(false);
                    return;
                }

                // Elimina duplicados
                const uniqueDatesMap: { [key: string]: boolean } = {};
                testDates.forEach((date: Date) => {
                    const year: number = date.getFullYear();
                    const month: string = String(date.getMonth() + 1).padStart(2, '0');
                    const day: string = String(date.getDate()).padStart(2, '0');
                    const dateKey: string = `${year}-${month}-${day}`;
                    uniqueDatesMap[dateKey] = true;
                });

                const uniqueDates: Date[] = Object.keys(uniqueDatesMap).map((dateStr: string) => {
                    const [year, month, day] = dateStr.split('-');
                    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
                });

                uniqueDates.sort((a: Date, b: Date) => b.getTime() - a.getTime());

                const today: Date = new Date();
                const todayFormatted: string = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                const didTestToday: boolean = uniqueDatesMap[todayFormatted] === true;

                if (!didTestToday) {
                    setStreak(0);
                    setLoading(false);
                    return;
                }

                let currentStreak: number = 1;
                let currentDate: Date = new Date();

                for (let i = 1; i < 1000; i++) {
                    const previousDate: Date = new Date(currentDate);
                    previousDate.setDate(previousDate.getDate() - 1);

                    const prevYear: number = previousDate.getFullYear();
                    const prevMonth: string = String(previousDate.getMonth() + 1).padStart(2, '0');
                    const prevDay: string = String(previousDate.getDate()).padStart(2, '0');
                    const previousDateFormatted: string = `${prevYear}-${prevMonth}-${prevDay}`;

                    const testOnPreviousDay: boolean = uniqueDatesMap[previousDateFormatted] === true;

                    if (testOnPreviousDay) {
                        currentStreak++;
                        currentDate = previousDate;
                    } else {
                        break;
                    }
                }

                setStreak(currentStreak);
                setLoading(false);
            } catch (err) {
                console.error("Error calculando la racha:", err);
                setError("No se pudo calcular la racha");
                setLoading(false);
            }
        };

        if (userId) {
            calculateStreak();
        }
    }, [userId]);

    if (loading) return <div> Calculando tu racha...</div>;
    if (error) return <div> Error: {error}</div>;

    return (
        <div className={styles["block-container"]}>
            <div className={styles["icon-container"]}>
                <i className="bi bi-lightning-fill"></i>
            </div>
            <div className={styles["info-container"]}>
                <p className={styles["result"]}>{streak}</p>
                <p className={styles["type-of-stat"]}>Racha de días</p>
            </div>
        </div>
    )
};

export default DayStreak;