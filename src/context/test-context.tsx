"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Pregunta = {
    id: string;
    pregunta: string;
    respuestas: string[];
    correcta: number;
};

export type UserAnswerType = {
    [key: string]: number;
};

export type ModuleQuestionState = {
    module: string;
    quantity: number;
    questions: Pregunta[];
    userAnswers: UserAnswerType;
};

export type TestContextType = {
    moduleQuestionStates: ModuleQuestionState[];
    setModuleQuestionStates: React.Dispatch<React.SetStateAction<ModuleQuestionState[]>>;
    moduleToBeShown: number;
    setModuleToBeShown: React.Dispatch<React.SetStateAction<number>>;
    answeredQuestionsByModule: number[];
    setAnsweredQuestionsByModule: React.Dispatch<React.SetStateAction<number[]>>;
    updateModuleQuestions: (moduleIndex: number, questions: Pregunta[]) => void;
    updateModuleAnswers: (moduleIndex: number, userAnswers: UserAnswerType) => void;
    resetTest: () => void;
};

const TestContext = createContext<TestContextType | undefined>(undefined);

const modulosData = [
    { module: "Modulo_1", quantity: 10 },
    { module: "Modulo_2", quantity: 3 },
    { module: "Modulo_3", quantity: 2 },
    { module: "Modulo_4", quantity: 3 },
    { module: "Modulo_5", quantity: 7 },
];

export const TestProvider = ({ children }: { children: ReactNode }) => {
    const [moduleQuestionStates, setModuleQuestionStates] = useState<ModuleQuestionState[]>(
        modulosData.map(({ module, quantity }) => ({
            module,
            quantity,
            questions: [],
            userAnswers: {}
        }))
    );

    const [moduleToBeShown, setModuleToBeShown] = useState(0);
    const [answeredQuestionsByModule, setAnsweredQuestionsByModule] = useState(
        modulosData.map(() => 0)
    );

    const updateModuleQuestions = (moduleIndex: number, questions: Pregunta[]) => {
        setModuleQuestionStates(prev =>
            prev.map((moduleState, index) =>
                index === moduleIndex ? { ...moduleState, questions } : moduleState
            )
        );
    };

    const updateModuleAnswers = (moduleIndex: number, userAnswers: UserAnswerType) => {
        setModuleQuestionStates(prev =>
            prev.map((moduleState, index) =>
                index === moduleIndex ? { ...moduleState, userAnswers } : moduleState
            )
        );

        setAnsweredQuestionsByModule(prev => {
            const newState = [...prev];
            newState[moduleIndex] = Object.keys(userAnswers).length;
            return newState;
        });
    };

    const resetTest = () => {
        setModuleQuestionStates(
            modulosData.map(({ module, quantity }) => ({
                module,
                quantity,
                questions: [],
                userAnswers: {}
            }))
        );
        setModuleToBeShown(0);
        setAnsweredQuestionsByModule(modulosData.map(() => 0));
    };

    const value: TestContextType = {
        moduleQuestionStates,
        setModuleQuestionStates,
        moduleToBeShown,
        setModuleToBeShown,
        answeredQuestionsByModule,
        setAnsweredQuestionsByModule,
        updateModuleQuestions,
        updateModuleAnswers,
        resetTest,
    };

    return (
        <TestContext.Provider value={value}>
            {children}
        </TestContext.Provider>
    );
};

export const useTest = () => {
    const context = useContext(TestContext);
    if (!context) {
        throw new Error('useTest debe ser usado dentro de un TestProvider');
    }
    return context;
};