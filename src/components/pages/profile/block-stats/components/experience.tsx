import styles from "@/styles/layout/profile/blockstats.module.scss";
import LoadingSkeleton from "../cards-loading.skeleton";

const Experience = ({ experience, loading }: { experience: number, loading: boolean }) => {

    if (loading) return <LoadingSkeleton />;

    return (
        <div className={styles["block-container"]}>
            <div className={styles["icon-container"]}>
                <i className="bi bi-stars"></i>
            </div>
            <div className={styles["info-container"]}>
                <p className={styles["result"]}>{experience}</p>
                <p className={styles["type-of-stat"]}>EXP Totales</p>
            </div>
        </div>
    )
}

export default Experience;