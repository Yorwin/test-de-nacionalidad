import React from "react";
import styles from "../../../styles-pages/module-practice.module.css"

interface ModuleContent {
    setModuleToBePracticed: (param: number) => void;
    toggleModulePractice: () => void;
}

const ModuleContent = ({ toggleModulePractice, setModuleToBePracticed }: ModuleContent) => {

    const arrayModulePractice = [{
        desc: "Gobierno, legislación y participación ciudadana.",
        icon: "bi bi-1-circle-fill",
        module: 1,
    },
    {
        desc: "Derechos y Deberes Fundamentales.",
        icon: "bi bi-2-circle-fill",
        module: 2,
    },
    {
        desc: "Organización Territorial de España, Geografía, y política.",
        icon: "bi bi-3-circle-fill",
        module: 3,
    },
    {
        desc: "Cultura e historia de España",
        icon: "bi bi-4-circle-fill",
        module: 4,
    },
    {
        desc: "Sociedad Española.",
        icon: "bi bi-5-circle-fill",
        module: 5,
    }]

    const startPractice = (e: number) => {
        setModuleToBePracticed(e)
        toggleModulePractice();
    };

    const contentArray = arrayModulePractice.map((e, index) => {
        return (
            <div className={styles["module-clickable-content"]} key={index}>
                <button onClick={() => startPractice(e.module)} className={styles["button-module"]}>
                    <div className={styles["module-practice"]}>
                        <div className={styles["icon-container"]}>
                            <i className={e.icon}></i>
                        </div>
                        <p className={styles["module-desc"]}>{e.desc}</p>
                    </div>
                </button>
            </div>
        )
    })

    return (
        <div className={styles["module-content-container"]}>
            {contentArray}
        </div>
    )
}

export default ModuleContent;