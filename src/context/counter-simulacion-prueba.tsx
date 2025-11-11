"use client"

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTestCompletion } from "@/functions/hooks/useTestCompletion";

type CounterPropsType = {
    children: React.ReactNode;
    onTimeUp?: () => void;
}

type CounterContextType = {
    timeLeft: number;
    isActive: boolean;
    startTimer: () => void;
    pauseTimer: () => void;
    getFormatedTime: () => string;
};

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const CounterProvider = ({ children }: CounterPropsType) => {

    const defaultTime = 25 * 60;

    const { completeTest } = useTestCompletion();
    const [timeLeft, setTimeLeft] = useState(defaultTime);;
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let timer: NodeJS.Timeout | number | null = null;

        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);

        } else if (timeLeft === 0) {
            if (timer) clearInterval(timer);
            // Calcular duración: tiempo total menos tiempo restante (que es 0)
            const totalTime = 25 * 60; // 25 minutos en segundos
            const duration = totalTime - timeLeft;
            completeTest(duration);
        }

        return () => {
            if (timer) clearInterval(timer);
        }

    }, [isActive, timeLeft]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    const getFormatedTime = () => formatTime(timeLeft);

    const startTimer = () => {
        setIsActive(true);
    }

    const pauseTimer = () => {
        setIsActive(false);
    }

    const value = {
        timeLeft,
        isActive,
        startTimer,
        pauseTimer,
        getFormatedTime,
    }

    return (
        <CounterContext.Provider value={value}>
            {children}
        </CounterContext.Provider>
    )
};

export const useCounter = () => {
    const context = useContext(CounterContext);
    if (!context) {
        throw new Error('useCounter debe ser usado dentro de un CounterProvider')
    }
    return context;
};