"use client"

import React, { useEffect, useState, useMemo } from "react";
import styles from "@/styles/layout/results/graphic-test-made.module.scss";
import { db, auth } from "@/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getFullDate, getDaysInMonth, getCurrentMonth, getCurrentDay } from "@/functions/functions";

interface weekItem {
    weekDay: string,
    duration: number,
}

//Superconjunto con abreviaciones de los días de la semana. 

const dayMap: Record<string, string> = {
    "Lunes": "Lun",
    "Martes": "Mar",
    "Miércoles": "Mié",
    "Jueves": "Jue",
    "Viernes": "Vie",
    "Sábado": "Sáb",
    "Domingo": "Dom",
};

interface DayData {
    day: string;
    hours: number;
}

const GraphicWeekSummary = () => {

    //Verificamos sí el usuario ha iniciado sesión. 

    const user = auth.currentUser;

    if (!user) {
        throw new Error('Usuario no autenticado');
    }

    const [data, setData] = useState<{ day: string; hours: number }[]>([]);
    const [totalHours, setTotalHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const getLast7DaysInCorrectFormat = (day: number) => {

        const last7Days: string[] = [];

        //Obtenemos la información de la fecha antes del bucle. 

        const Date = getFullDate();
        const currentMonth = getCurrentMonth();
        let guideDay = day;
        let neverChangedMonth = true; //El neverChangedMonth comienza en true para indicar que en princio al ir 7 días hacia atras no ocurre un cambio de mes. 

        for (let i = 0; i < 7; i++) {

            //En la primera iteración siempre se devuelve el día actual. 
            if (i === 0) {
                last7Days.push(Date);
            }

            //En las siguientes aplicamos lógica para crear el formato correctos con los días anteriores. 

            if (i > 0) {

                let lastDay = guideDay - 1;

                if (lastDay > 0 && neverChangedMonth) {
                    guideDay = lastDay;
                    let LastDayFullFormat = lastDay + Date.substring(2, 9);
                    last7Days.push(LastDayFullFormat);
                }

                //En el caso de que lastDay sea igual a 0, y luego cuando neverChanged pasa a ser false ejecutamos este código que coloca el mes anterior. 

                if (lastDay === 0 || !neverChangedMonth) {

                    neverChangedMonth = false;

                    let lastMonth = currentMonth - 1;
                    let getDaysInLastMonth = getDaysInMonth(lastMonth, 2025);
                    lastDay = lastDay === 0 ? getDaysInLastMonth : guideDay - 1;
                    guideDay = lastDay;

                    let LastDayFullFormat = `${lastDay}/${lastMonth + Date.substring(4, 9)}`
                    last7Days.push(LastDayFullFormat);
                }
            }
        }

        //Terminamos devolviendo el array con los días correspondientes en su formato correcto. 
        return last7Days;
    };

    //Según el día de la semana actual calcula yendo hacía atras cuales serían los días anteriores. 

    const calculateWeekDay = (index: number) => {
        const date = new Date();
        const dayNumber = date.getDay();
        const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        const adjustedIndex = (dayNumber - index + 7) % 7;

        return weekDays[adjustedIndex];
    };

    //Prepara la información para realizar la petición que se necesita.

    const prepareData = (array: weekItem[]) => {
        const preparedData = array.map((item: weekItem) => ({
            day: dayMap[item.weekDay] || item.weekDay,
            hours: Number((item.duration / 3600).toFixed(2)) // convertir minutos a horas y redondear
        }));

        return preparedData;
    };

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
                    //duration: Math.max(1500 - (item.duration ?? 0), 0),
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


    //Calcular horas totales prácticadas en la semana.
    const getTotalHours = (data: DayData[]): number => data.reduce((total, item) => total + item.hours, 0);

    //Obtenemos la información de firestore. 
    const getWeekInfo = async (monthDays: string[]) => {

        const dataOfTheWeek = await Promise.all(monthDays.map(async (e, index) => {
            const weekInfoRef = collection(db, "users", user.uid, "resultados");
            const q = query(
                weekInfoRef,
                where("Date", "==", e),
                where("testId", "==", "test_simulation")
            );
            const snapshot = await getDocs(q);

            const resultWeekDay = calculateWeekDay(index)

            const data = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    weekDay: resultWeekDay,
                    ...doc.data()
                }
            });

            return data;
        }));

        return dataOfTheWeek;
    };

    //Con todo lo preparado obtenemos la información que necesitamos usando un Promise. 

    const day = getCurrentDay();

    //Usamos useMemo para evitar la constante renderización del componente, guardando en memoria el resultado de monthDays, y usandolo más tarde como dependencia. 
    const monthDays = useMemo(() => {
        return getLast7DaysInCorrectFormat(day);
    }, [day]);

    function getDecimalPartAsMinutes(decimalHours: number) {
        // Extraer solo la parte decimal
        const decimalPart = decimalHours - Math.floor(decimalHours);

        // Convertir la parte decimal a minutos (60 minutos por hora)
        const minutes = Math.round(decimalPart * 60);

        return minutes;
    }

    function getHoursOnly(decimalHours: number) {
        return Math.floor(decimalHours);
    }

    useEffect(() => {
        getWeekInfo(monthDays)
            .then((element) => {
                const processedData = processWeekArray(element);
                setData(processedData);

                const totalHours = getTotalHours(processedData);
                const getOnlyHours = getHoursOnly(totalHours);
                const totalMinutes = getDecimalPartAsMinutes(totalHours);

                setTotalHours(getOnlyHours);
                setMinutes(totalMinutes);
            });

    }, [monthDays]);

    const maxHours = Math.max(...data.map(d => d.hours));
    const maxHeightPx = 100;


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