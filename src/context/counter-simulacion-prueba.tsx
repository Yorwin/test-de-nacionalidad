"use client"

import React, { createContext, useContext, useState, useEffect } from "react";

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

export const CounterProvider = ({ children, onTimeUp }: CounterPropsType) => {

    const defaultTime = 25 * 60;

    const [timeLeft, setTimeLeft] = useState(() => {
        const savedTime = sessionStorage.getItem("cronometro");
        return savedTime ? Number(savedTime) : defaultTime;
    });

    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let timer: NodeJS.Timeout | number | null = null;

        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
                sessionStorage.setItem("cronometro", `${timeLeft}`);
            }, 1000);

        } else if (timeLeft === 0) {
            if (timer) clearInterval(timer);
            if (onTimeUp) {
                onTimeUp();
            } else {
                alert("¡Tiempo Terminado!");
            }
        }

        return () => {
            if (timer) clearInterval(timer);
        }

    }, [isActive, timeLeft, onTimeUp]);

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

    /*
    
    Funciones para controlar el contador (A Guardar por si fuese necesario usarlas en otro componente)
    
    const resetTimer = () => {
        if (intervalId) {
            clearInterval(intervalId)
        }
    
        setTimeLeft(25 * 60);
        setIsActive(false);
        setIntervalId(null);
    };
    
    */

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