"use client"

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

/* Context */
import { AuthProvider } from "@/context/auth-context";

const Results = () => {
    return (
        <div className={styles["main-container-results"]}>
            <div className={styles["content-container"]}>
                {/* Header */}
                <div className={styles["main-page-header"]}>
                    <div className={styles["title-container"]}>
                        <TituloGenerico titulo="Resultados exámenes" />
                    </div>

                    <div className={styles["container-arrow-go-back"]}>
                        <Link href={"/"}>
                            <ArrowGoBack />
                        </Link>
                    </div>
                </div>

                {/* Graphs */}
                <AuthProvider>
                    <div className={styles["graphics-main-container"]}>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-2 col-sm-12 mb-sm-3 d-flex justify-content-center">
                                    <GraphRightTestsPercentage />
                                </div>
                                <div className="col-md-3 col-sm-6 mb-sm-5 d-flex justify-content-center">
                                    <GraphicHoursSimulated />
                                </div>
                                <div className="col-md-3 col-sm-6 mb-sm-5 d-flex justify-content-center">
                                    <GraphicTestsMade />
                                </div>
                                <div className="col-md-4 col-sm-12 mb-sm-5 d-flex justify-content-center">
                                    <GraphicWeekSummary />
                                </div>
                            </div>
                        </div>

                        <HistoryOfSimulations />
                    </div>
                </AuthProvider>
            </div>
        </div>
    )
};

export default Results;
