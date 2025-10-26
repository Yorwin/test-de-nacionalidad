import ColumnChart from "@/components/pages/module-practice/graph/column-chart";
import styles from "@/styles/layout/practica-por-modulo/practica-por-modulo.module.scss";

const Graph = () => {
    return (
        <div className={styles["graph-container"]}>
            <div className={styles["title-container"]}>
                <h2>Grado de Preparación por Modulo</h2>
            </div>
            <ColumnChart />
        </div>
    )
};

export default Graph;