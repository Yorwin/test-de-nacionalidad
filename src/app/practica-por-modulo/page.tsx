import styles from "@/styles/layout/practica-por-modulo/practica-por-modulo.module.scss";

/* Components */
import Header from "@/components/pages/module-practice/header";
import ModuleContent from "@/components/pages/module-practice/module-content";
import Graph from "@/components/pages/module-practice/graph/graph";

/* Context */
import { AuthProvider } from "@/context/auth-context";

const ModulePractice = () => {
    return (
        <AuthProvider>
            <div className={styles["main-container-module-practice-home"]}>
                <Header />
                <ModuleContent />
                <div className={styles["divisor-line-container"]}>
                    <div className={styles["divisor-line"]}></div>
                </div>
                <Graph />
            </div>
        </AuthProvider>
    )
};

export default ModulePractice;