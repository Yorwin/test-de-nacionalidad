"use client"

import React, { useEffect, useState, useMemo } from "react";
import styles from "@/styles/layout/results/graphic-test-made.module.scss";

/* Types */
import { weekItem } from "@/types/types";

/* Functions */
import { getLast7DaysInCorrectFormat, getCurrentDay, calculateWeekDay, getTotalHours, prepareData, getDecimalPartAsMinutes, getHoursOnly } from "@/functions/functions";

/* Context */
import { useAuth } from "@/context/auth-context";

/* Firebase */
import { db } from "@/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const GraphicWeekSummary = () => {

    //Verificamos sí el usuario ha iniciado sesión. 
    const { user, loading: authLoading } = useAuth();

    const [data, setData] = useState<{ day: string; hours: number }[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    //Función donde se procesa el array con los días de la semana. 
    const processWeekArray = (array: any) => {

        const processedWeekArray = array.map((e: any, index: number) => {

            let weekDay = calculateWeekDay(index);

            /*Preparamos dos casos, el día de la semana no tiene datos, entregando un objeto, con una duración de cero, o el día de la sema si tiene datos, 
            donde hacer un punto map. En el .map añadimos el día de semana y calculamos la duración */

            if (e.length === 0) {
                return [{
                    id: `default-value for day ${weekDay}`,
                    weekDay: weekDay,
                    duration: 0,
                }];
            } else {
                return e.map((item: any) => ({
                    weekDay: weekDay,
                    duration: 1500 - (item.duration ?? 0),
                }));
            }
        });

        //Aplatamos el array para mejorar su manipulación.
        const flattenedProcessedArray = processedWeekArray.flat();

        //Esta función devuelve un array con los días de la semana habiendo sumado todas las duraciones facilitadas.  
        const summarizedWeekArray = flattenedProcessedArray.reduce((acc: weekItem[], curr: weekItem) => {

            const existing = acc.find(item => item.weekDay === curr.weekDay);

            if (existing) {
                existing.duration += curr.duration;
            } else {
                acc.push({
                    weekDay: curr.weekDay,
                    duration: curr.duration,
                });
            }

            return acc;
        }, []);

        const finalData = prepareData(summarizedWeekArray);

        return finalData;
    };

    //Con todo lo preparado obtenemos la información que necesitamos usando un Promise. 
    const day = getCurrentDay();

    //Usamos useMemo para evitar la constante renderización del componente, guardando en memoria el resultado de monthDays, y usandolo más tarde como dependencia. 
    const monthDays = useMemo(() => {
        return getLast7DaysInCorrectFormat(day);
    }, [day]);

    useEffect(() => {
        const getWeekInfo = async (monthDays: string[]) => {

            if (!user) {
                return null;
            }

            try {

                /* Obtener información de la semana de Firestore */
                const dataOfTheWeek = await Promise.all(monthDays.map(async (e, index) => {
                    const weekInfoRef = collection(db, "users", user.uid, "resultados");
                    const q = query(
                        weekInfoRef,
                        where("Date", "==", e),
                        where("testId", "==", "test_simulation")
                    );

                    const snapshot = await getDocs(q);
                    const resultWeekDay = calculateWeekDay(index);

                    const data = snapshot.docs.map(doc => {
                        return {
                            id: doc.id,
                            weekDay: resultWeekDay,
                            ...doc.data()
                        }
                    });

                    return data;
                }));

                const processedData = processWeekArray(dataOfTheWeek);

                setData(processedData);

                const totalHours = getTotalHours(processedData);
                const getOnlyHours = getHoursOnly(totalHours);
                const totalMinutes = getDecimalPartAsMinutes(totalHours);

                setTotalHours(getOnlyHours);
                setMinutes(totalMinutes);
            } catch (error) {
                console.error(`Se ha producido un error al intentar calcular el registro de la semana`);
                return null;
            }
        };

        getWeekInfo(monthDays);
    }, [monthDays, user]);

    const maxHours = Math.max(...data.map(d => d.hours));
    const maxHeightPx = 100;

    if (authLoading) {
        return (
            <h3>Cargando...</h3>
        )
    }

    return <>
        <div className={styles["main-container-weeklygraphic"]}>

            {/* Icon */}

            <div className={styles["container-icon"]}>
                <i className="bi bi-bar-chart-line-fill"></i>
            </div>

            {/* Week Title */}

            <div className={styles["weekly-graph-title"]}>
                <h3>{`${totalHours} hr ${minutes}mins`}</h3>
                <p>Historial semana</p>
            </div>

            {/* Graph */}

            <div className={styles["graph-container"]} style={{ height: "250px" }}>

                <div className={styles["base-line-graph"]}></div>

                {data.map((item, index) => {
                    const height = (item.hours / maxHours) * maxHeightPx;

                    return (
                        <div key={index} className={styles["graph-text-container"]}>
                            <div
                                className={styles["candle-graph"]}
                                style={{
                                    height: `${height}px`,
                                    margin: "0 auto",
                                    transition: "height 0.3s ease",
                                }}
                                title={`${item.hours} horas`}
                            ></div>
                            <small className={styles["graph-text"]}>{item.day}</small>
                        </div>
                    );
                })}
            </div>
        </div>
    </>
};

export default GraphicWeekSummary;