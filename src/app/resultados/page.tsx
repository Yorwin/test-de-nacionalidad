"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from '@/styles/layout/results/results.module.scss';

/* Componentes Genericos */

import TituloGenerico from "@/components/generic-title";
import ArrowGoBack from "@/components/arrow-go-back";

/* Componentes de Página */

import GraphicTestsMade from "@/components/pages/results/graphic-tests-made";
import GraphicHoursSimulated from "@/components/pages/results/graphic-hours-simulated";
import GraphRightTestsPercentage from "@/components/pages/results/graphic-percentage-right-answers";
import GraphicWeekSummary from "@/components/pages/results/graphic-week-summary";
import HistoryOfSimulations from "@/components/pages/results/history-of-simulations";
import SimulationResults from "@/components/pages/results/simulation-results/simulation-results";

/* Firebase */
import { db, auth } from "@/firebase/firebase"
import { getDocs, collection } from "firebase/firestore";

/* Context */
import { AuthProvider } from "@/context/auth-context";

const Results = () => {

    const [totalTests, setTestsTotal] = useState(0);
    const [correctTests, setCorrectTests] = useState(0);
    const [incorrectTests, setIncorrectTests] = useState(0);

    const [simulationResult, setSimulationResult] = useState(false);
    const [idResult, setIdResult] = useState("");

    const user = auth.currentUser;

    if (!user) {
        throw new Error("Usuario no autenticado");
    }

    const getTestsResults = async () => {
        const totalTestsResults: number[] = [];
        const resultsRef = collection(db, "users", user.uid, "resultados");
        const querySnapshot = await getDocs(resultsRef);

        querySnapshot.forEach(doc => {
            const data = doc.data();

            if (data.testId === "test_simulation") {
                const score = data.score;
                totalTestsResults.push(score);
            }
        })

        return totalTestsResults;
    };

    const isTestValid = (results: number[]) => {
        let correctAnswers = 0;

        results.forEach((e: number) => {
            if (e >= 20) {
                correctAnswers = + 1;
            }
        })

        return correctAnswers;
    };

    const getTestsInfo = () => {
        getTestsResults()
            .then((e) => {
                setTestsTotal(e.length);
                return e;
            }).then((e) => {
                const approvedTests = isTestValid(e);
                setCorrectTests(approvedTests);
                return { e, approvedTests };
            }).then((e) => {
                const incorrectTests = e.e.length - e.approvedTests;
                setIncorrectTests(incorrectTests);
            });
    };

    const toggleShowSimulationResult = (element: any) => {

        setSimulationResult(e => !e);

        let questionId;

        if (!simulationResult) {
            questionId = element;
            setIdResult(questionId);
        }

        return questionId;
    }

    useEffect(() => {
        getTestsInfo()
    })

    return <>
        <div className={styles["main-container-results"]}>
            <div className={styles["content-container"]}>
                {simulationResult ? <SimulationResults showSimulationResult={toggleShowSimulationResult} questionId={idResult} /> : (
                    <>
                        {/* Header */}
                        <div className={styles["title-container"]}>
                            <TituloGenerico titulo="Resultados exámenes" />
                        </div>

                        <div className={styles["container-arrow-go-back"]}>
                            <Link href={"/"}>
                                <ArrowGoBack />
                            </Link>
                        </div>

                        {/* Graphs */}
                        <AuthProvider>
                            <div className={styles["graphics-main-container"]}>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-2 col-sm-12 d-flex justify-content-center mb-sm-3">
                                            <div>
                                                <GraphRightTestsPercentage totalTests={totalTests} correctTests={correctTests} />
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-sm-6 mb-sm-5 d-flex justify-content-center">
                                            <GraphicHoursSimulated /> {/* Ya funciona independientemente */}
                                        </div>
                                        <div className="col-md-3 col-sm-6 mb-sm-5 d-flex justify-content-center">
                                            <GraphicTestsMade correctTests={correctTests} incorrectTests={incorrectTests} totalTests={totalTests} />
                                        </div>
                                        <div className="col-md-4 col-sm-12 mb-sm-5 d-flex justify-content-center">
                                            <GraphicWeekSummary />
                                        </div>
                                    </div>

                                    {/* History of Simulations*/}

                                    <div className="row">
                                        <div className={styles["container-history-simulations"]}>
                                            <HistoryOfSimulations showSimulationResult={toggleShowSimulationResult} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AuthProvider>
                    </>
                )}
            </div>
        </div>
    </>
};

export default Results;
