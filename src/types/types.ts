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