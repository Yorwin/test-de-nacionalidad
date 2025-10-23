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
    return (seconds / 3600).toFixed(1); // redondea a 2 decimales
}

export const getCurrentSecondsSinceMidNight = () => {

    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    //Convert hours and minutes to seconds.
    const totalSeconds = (hours * 3600) + (minutes * 60);

    return totalSeconds;
};