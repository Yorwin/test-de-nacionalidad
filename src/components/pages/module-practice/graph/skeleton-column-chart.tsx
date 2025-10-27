import styles from "@/styles/layout/practica-por-modulo/practica-por-modulo.module.scss";

const SkeletonColumnChart = () => {
    return (
        <div className={styles["column-chart"]}>
            <div className={`skeleton-rect ${styles["chart-skeleton"]}`}></div>
        </div>
    )
};

export default SkeletonColumnChart;