"use client"

import React, { useState } from "react";
import Header from "@/components/pages/module-practice/header";
import ModuleContent from "@/components/pages/module-practice/module-content";
import Graph from "@/components/pages/module-practice/graph/graph";
import TestPage from "@/components/pages/module-practice/test-page/test-page";
import styles from "@/styles/layout/practica-por-modulo/practica-por-modulo.module.scss";
import { AuthProvider } from "@/context/auth-context";

const ModulePractice = () => {
    const [startedModulePractice, setStartedModulePractice] = useState(false);
    const [moduleNumber, setModuleNumber] = useState(1);

    const toggleStartedModulePractice = () => {
        setStartedModulePractice(e => !e);
    }

    const setModuleToBePracticed = (moduleNumber: number) => {
        sessionStorage.setItem("module", `${moduleNumber}`);
        setModuleNumber(moduleNumber);
    };

    return <>
        <AuthProvider>
            {startedModulePractice || (typeof window !== 'undefined' && sessionStorage.getItem("module")) ?
                <div className={styles["main-container-module-practice"]}>
                    <TestPage toggleModulePractice={toggleStartedModulePractice} moduleNumber={moduleNumber} />
                </div>
                :
                <>
                    <div className={styles["main-container-module-practice-home"]}>
                        <Header />
                        <ModuleContent toggleModulePractice={toggleStartedModulePractice} setModuleToBePracticed={setModuleToBePracticed} />
                        <div className={styles["divisor-line-container"]}>
                            <div className={styles["divisor-line"]}></div>
                        </div>
                        <Graph />
                    </div>
                </>}
        </AuthProvider>
    </>
};

export default ModulePractice;