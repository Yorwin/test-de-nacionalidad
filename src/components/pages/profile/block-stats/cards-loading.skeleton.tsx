import styles from "@/styles/layout/profile/blockstats.module.scss";

const LoadingSkeleton = () => {
    return (
        <div className={`skeleton-rect ${styles["card-loading-item"]}`}></div>
    )
};

export default LoadingSkeleton;