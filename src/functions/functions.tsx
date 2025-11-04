import { DayData, weekItem, dayMap } from "@/types/types";

export const getFullDate = () => {

    const currentDate = new Date();

    const today = currentDate.getDate();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const anio = currentDate.getFullYear();

    const fullDate = `${today}/${month}/${anio}`

    return fullDate;
};

export const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month, 0).getDate();
};

export const getCurrentMonth = () => {

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;

    return month;
};

export const getCurrentDay = () => {
    const currentDay = new Date();
    const day = currentDay.getDate();

    return day;
}

export const getWeekDay = (dayNumberParam: number) => {

    const daysOfTheWeek = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sábado",
    ];

    return daysOfTheWeek[dayNumberParam];
};

export function secondstoDecimalHours(seconds: number) {
    return (seconds / 3600).toFixed(2); // redondea a 2 decimales
}

export const getCurrentSecondsSinceMidNight = () => {

    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    //Convert hours and minutes to seconds.
    const totalSeconds = (hours * 3600) + (minutes * 60);

    return totalSeconds;
};

export const getLast7DaysInCorrectFormat = (day: number) => {

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
                let LastDayFullFormat = lastDay + Date.substring(2);

                last7Days.push(LastDayFullFormat);
            }

            //En el caso de que lastDay sea igual a 0, y luego cuando neverChanged pasa a ser false ejecutamos este código que coloca el mes anterior. 

            if (lastDay === 0 || !neverChangedMonth) {

                neverChangedMonth = false;

                let lastMonth = currentMonth - 1;
                let getDaysInLastMonth = getDaysInMonth(lastMonth, 2025);
                lastDay = lastDay === 0 ? getDaysInLastMonth : guideDay - 1;
                guideDay = lastDay;

                let LastDayFullFormat = `${lastDay}/${lastMonth + Date.substring(4)}`
                last7Days.push(LastDayFullFormat);
            }
        }
    }

    //Terminamos devolviendo el array con los días correspondientes en su formato correcto. 
    return last7Days;
};

//Según el día de la semana actual calcula yendo hacía atras cuales serían los días anteriores. 

export const calculateWeekDay = (index: number) => {
    const date = new Date();
    const dayNumber = date.getDay();
    const weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const adjustedIndex = (dayNumber - index + 7) % 7;

    return weekDays[adjustedIndex];
};

//Prepara la información para realizar la petición que se necesita.

export const prepareData = (array: weekItem[]) => {
    const preparedData = array.map((item: weekItem) => ({
        day: dayMap[item.weekDay] || item.weekDay,
        hours: Number((item.duration / 3600).toFixed(2)) // convertir minutos a horas y redondear
    }));

    return preparedData;
};

//Calcular horas totales prácticadas en la semana.
export const getTotalHours = (data: DayData[]): number => data.reduce((total, item) => total + item.hours, 0);

export function getDecimalPartAsMinutes(decimalHours: number) {
    // Extraer solo la parte decimal
    const decimalPart = decimalHours - Math.floor(decimalHours);

    // Convertir la parte decimal a minutos (60 minutos por hora)
    const minutes = Math.round(decimalPart * 60);

    return minutes;
}

export function getHoursOnly(decimalHours: number) {
    return Math.floor(decimalHours);
}

/* Verificar Test */

export const isTestValid = (results: number[]) => {
    let correctAnswers = 0;

    results.forEach((e: number) => {
        if (e >= 20) {
            correctAnswers = + 1;
        }
    })

    return correctAnswers;
};

export const calculateCreatedAtMs = (createdAt: { seconds: number, nanoseconds: number }) => {
    const date = new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1e6);

    const month = date.toLocaleString("es-ES", { month: "long" });
    const year = date.getFullYear();

    const formatted = `Cuenta creada en ${month.charAt(0).toUpperCase() + month.slice(1)} del ${year}`;

    return formatted;
};

