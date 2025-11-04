"use client"

import { useEffect, useState } from "react";
import styles from "@/styles/layout/profile/blockstats.module.scss";
import { collection, query, getDocs, orderBy, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from "@/firebase/firebase";

/* Loading Skeleton */
import LoadingSkeleton from "../cards-loading.skeleton";

interface LongestDayStreakProps {
    userId: string;
}

const LongestDayStreak = ({ userId }: LongestDayStreakProps) => {

    const [streak, setStreak] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const calculateLongestStreak = async (): Promise<void> => {
            try {
                setLoading(true);

                const resultsRef = collection(db, `users/${userId}/resultados`);
                const resultsQuery = query(resultsRef, orderBy('Date', 'desc'));
                const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(resultsQuery);

                const testDates: Date[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.Date && typeof data.Date === 'string') {
                        const dateParts: string[] = data.Date.split('/');
                        const parsedDate: Date = new Date(
                            parseInt(dateParts[2], 10),
                            parseInt(dateParts[1], 10) - 1,
                            parseInt(dateParts[0], 10)
                        );
                        testDates.push(parsedDate);
                    }
                });

                if (testDates.length === 0) {
                    setStreak(0);
                    setLoading(false);
                    return;
                }

                // Elimina fechas duplicadas por día (solo importa si hubo test ese día)
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

                // Ordena ascendente (más antiguo primero)
                uniqueDates.sort((a: Date, b: Date) => a.getTime() - b.getTime());

                let longestStreak: number = 0;
                let currentStreak: number = 1;

                for (let i = 1; i < uniqueDates.length; i++) {
                    const prevDate: Date = uniqueDates[i - 1];
                    const currentDate: Date = uniqueDates[i];

                    // Calcula diferencia en días entre dos fechas consecutivas
                    const diffInTime: number = currentDate.getTime() - prevDate.getTime();
                    const diffInDays: number = diffInTime / (1000 * 3600 * 24);

                    if (diffInDays === 1) {
                        currentStreak++;
                    } else {
                        longestStreak = Math.max(longestStreak, currentStreak);
                        currentStreak = 1;
                    }
                }

                longestStreak = Math.max(longestStreak, currentStreak); // Por si termina con la racha más larga

                setStreak(longestStreak); // Reutilizamos el mismo setter, o crea otro si quieres mostrar ambos
                setLoading(false);
            } catch (err) {
                console.error("Error calculando la racha más larga:", err);
                setError("No se pudo calcular la racha más larga");
                setLoading(false);
            }
        };

        if (userId) {
            calculateLongestStreak();
        }
    }, [userId]);

    if (loading) return <LoadingSkeleton />;
    if (error) return <div> Error: {error}</div>;

    return (
        <div className={styles["block-container"]}>
            <div className={styles["icon-container"]}>
                <i className="bi bi-train-freight-front"></i>
            </div>
            <div className={styles["info-container"]}>
                <p className={styles["result"]}>{streak}</p>
                <p className={styles["type-of-stat"]}>Racha más larga</p>
            </div>
        </div>
    )
}

export default LongestDayStreak;