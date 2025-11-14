"use client"

import React, { useState, useEffect } from "react";
import styles from "@/styles/layout/practica-por-modulo/practica-por-modulo.module.scss";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "@/context/auth-context";
import SkeletonColumnChart from "./skeleton-column-chart";

interface testValue {
    id: string,
    score: number,
}

interface preparedData {
    moduleName: string,
    correctAnswers: number,
    totalQuestions: number,
    preparationPercentage: number,
}

interface totalQuestions {
    [moduleName: string]: number,
}

const ColumnChart = () => {

    const { user } = useAuth();

    const [contentLoading, setContentLoading] = useState<boolean>(true);
    const [chartData, setChartData] = useState<number[]>([0, 0, 0, 0, 0]);
    const [svgHeight, setSvgHeight] = useState(450);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 568) {
                setSvgHeight(900); // aún más alto en pantallas muy pequeñas
            } else if (width < 768) {
                setSvgHeight(750); // más alto en pantallas pequeñas
            } else {
                setSvgHeight(450); // altura normal
            }
        };

        const getAmountOfQuestions = async () => {
            try {
                const modules = [1, 2, 3, 4, 5];

                const moduleCounts: Record<string, number> = {};

                for (const modNumber of modules) {
                    const questionsSnap = await getDocs(collection(db, "preguntas", `Modulo_${modNumber}`, "preguntas"));
                    moduleCounts[`Modulo_${modNumber}`] = questionsSnap.size;
                }

                return [moduleCounts];
            } catch (error) {
                console.error("No se puedo obtener el total de preguntas correctamente");
            }
        };

        const getModulePracticesByNumber = async (moduleNumber: number) => {
            if (!user) {
                return [];
            }

            const q = query(
                collection(db, "users", user.uid, "resultados"),
                where("module_number", "==", `${moduleNumber}`) // O asegúrate de que en Firestore es tipo número
            );

            const querySnapshot = await getDocs(q);
            const results: testValue[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                results.push({
                    id: doc.id,
                    score: data.score,
                });
            });

            return results;
        };

        const updateModulePreparationPercentage = (preparedData: preparedData[]) => {

            const arrayPreparartionPercentage: number[] = [];

            preparedData.forEach((element: any) => {
                arrayPreparartionPercentage.push(element.preparationPercentage);
            })

            setChartData(arrayPreparartionPercentage);
        };

        function calculateModulePreparations(responsesByModule: testValue[][], totalQuestionsByModule: totalQuestions[]) {
            // Verificamos que totalQuestionsByModule exista y tenga al menos un elemento
            const totalsObject = totalQuestionsByModule &&
                totalQuestionsByModule.length > 0 ?
                totalQuestionsByModule[0] : {};

            // Si totalsObject es undefined o null, usamos un objeto vacío
            const safeModuleTotals = totalsObject || {};

            // Calcula la preparación para cada módulo individualmente
            const modulePreparations = responsesByModule.map((moduleResponses: any, index: any) => {
                // Aseguramos que moduleResponses sea un array (si es undefined, usamos array vacío)
                const safeModuleResponses = Array.isArray(moduleResponses) ? moduleResponses : [];

                // Obtiene el nombre del módulo
                const moduleName = `Modulo_${index + 1}`;

                // Obtenemos el total de preguntas para este módulo de manera segura
                const totalQuestions = safeModuleTotals[moduleName] || 0;

                // Si no hay respuestas, retornamos 0%
                if (safeModuleResponses.length === 0) {
                    return {
                        moduleName,
                        correctAnswers: 0,
                        totalQuestions,
                        preparationPercentage: 0,
                        testsMade: 0
                    };
                }

                // Calculamos el promedio de las puntuaciones de todos los tests realizados
                // Para cada test, calculamos su porcentaje individual y luego promediamos
                let testScores = safeModuleResponses.map(response => {
                    // Verificamos que response y response.score existan
                    const score = response && typeof response.score === 'number' ? response.score : 0;
                    // Calculamos el porcentaje para este test individual
                    return totalQuestions === 0 ? 0 : (score / totalQuestions) * 100;
                });

                // Promediamos los porcentajes de todos los tests
                const averageScore = testScores.reduce((sum, score) => sum + score, 0) / testScores.length;

                // Redondeamos el resultado final
                const preparationPercentage = Math.round(averageScore);

                // Suma total de respuestas correctas (para referencia)
                const correctAnswers = safeModuleResponses.reduce((sum, response) => {
                    return sum + (response && typeof response.score === 'number' ? response.score : 0);
                }, 0);

                return {
                    moduleName,
                    correctAnswers,
                    totalQuestions,
                    preparationPercentage,
                    testsMade: safeModuleResponses.length
                };
            });

            return modulePreparations;
        }

        const fetchAllModules = async () => {
            try {
                const modulePromises = [1, 2, 3, 4, 5].map((modNumber) => {
                    const modulePractices = getModulePracticesByNumber(modNumber)
                    return modulePractices;
                });

                const allModuleResults = await Promise.all(modulePromises);
                const modulesLength = await getAmountOfQuestions();

                const preparationData = calculateModulePreparations(allModuleResults, modulesLength ?? []);

                updateModulePreparationPercentage(preparationData);
            } catch (error) {
                console.error("Error al intentar obtener los datos de los módulos:", error);
            } finally {
                setContentLoading(false);
            }
        };

        fetchAllModules();
        handleResize(); // establecer altura inicial

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [user]);

    if (contentLoading) {
        return (
            <SkeletonColumnChart />
        );
    }

    const svgWidth = 1100;
    const padding = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const yAxisValues = [0, 20, 40, 60, 80, 100];
    const columnWidth = chartWidth / chartData.length * 0.6;
    const columnSpacing = chartWidth / chartData.length;
    const moduleNames = ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4", "Módulo 5"];

    const scaleY = (value: number) => {
        return chartHeight - (value / 100) * chartHeight + padding.top;
    };

    return (
        <div className={styles["column-chart"]}>
            <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                preserveAspectRatio="xMidYMid meet"
                className={styles["charts-border"]}
                style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "1100px",
                    borderTop: '5px solid #322B2A',
                    borderLeft: '5px solid #322B2A',
                    borderRight: '5px solid #322B2A',
                    borderBottom: 'none'
                }}
            >
                {/* Eje Y con etiquetas */}
                {yAxisValues.map((value, index) => (
                    <g key={`y-axis-${index}`} className={styles["text"]}>
                        <text
                            x={padding.left - 10}
                            y={scaleY(value)}
                            textAnchor="end"
                            dominantBaseline="middle"
                            className={styles["text-chart"]}
                        >
                            {value}%
                        </text>
                    </g>
                ))}

                {/* Columnas y etiquetas del eje X */}
                {chartData.map((value, index) => {
                    const x = padding.left + index * columnSpacing + columnSpacing / 2;

                    return (
                        <g key={`column-${index}`}>
                            <rect
                                x={x - columnWidth / 2}
                                y={scaleY(value)}
                                width={columnWidth}
                                height={scaleY(0) - scaleY(value)}
                                fill="#CF4037"
                                stroke="#b53229"
                                strokeWidth="1"
                            />

                            <text
                                x={x}
                                y={scaleY(value) - 5}
                                textAnchor="middle"
                                className={styles["text-percentage"]}
                            >
                                {value}%
                            </text>

                            <text
                                x={x}
                                y={padding.top + chartHeight + 25}
                                textAnchor="middle"
                                className={styles["text-chart"]}
                            >
                                {moduleNames[index]}
                            </text>
                        </g>
                    );
                })}

                {/* Ejes principales */}
                <line
                    x1={padding.left}
                    y1={padding.top}
                    x2={padding.left}
                    y2={padding.top + chartHeight}
                    stroke="#A55A55"
                    strokeWidth="4"
                />
                <line
                    x1={padding.left}
                    y1={padding.top + chartHeight}
                    x2={padding.left + chartWidth}
                    y2={padding.top + chartHeight}
                    stroke="#A55A55"
                    strokeWidth="4"
                />
            </svg>
        </div>
    );
};

export default ColumnChart;
