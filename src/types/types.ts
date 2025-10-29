type SavedQuestionValue = number | string | null;

export type QAEntry = {
    [key: string]: string | number;
}

export interface verifiedAnswersBeforeResults {
    [code: string]: number;
}

export interface SaveResults {
    testId: string,
    score: number,
    answers: verifiedAnswersBeforeResults[];
    duration: number,
    questions: string[],
}

export interface questionType {
    correcta: number,
    pregunta: string,
    respuestas: string[],
}

export type saveQuestionAnswerLocally = (key: string, value: SavedQuestionValue) => void;
export type saveAnswersInServer = (key: string, value: SavedQuestionValue) => void;
export type saveQuestionsInServer = (testId: string, score: number, answers: verifiedAnswersBeforeResults[]) => void;

export type SaveResultsModulePractice = (testId: string, score: number, answers: verifiedAnswersBeforeResults[], module_number: string | null) => Promise<string>;

//Superconjunto con abreviaciones de los días de la semana. 
export const dayMap: Record<string, string> = {
    "Lunes": "Lun",
    "Martes": "Mar",
    "Miércoles": "Mié",
    "Jueves": "Jue",
    "Viernes": "Vie",
    "Sábado": "Sáb",
    "Domingo": "Dom",
};

export interface DayData {
    day: string;
    hours: number;
}

export interface weekItem {
    weekDay: string,
    duration: number,
}
