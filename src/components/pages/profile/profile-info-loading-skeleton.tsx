import styles from "@/styles/layout/profile/profile-info.module.scss";

const ProfileInfoLoadingSkeleton = () => {
    return (
        <div className={styles["profile-loader-container"]}>
            <div className={`skeleton-rect ${styles["profile-image-loader"]}`}></div>
            <div className={styles["profile-info-loader"]}>
                <div className={`skeleton-rect ${styles["profile-name"]}`}></div>
                <div className={`skeleton-rect ${styles["profile-desc"]}`}></div>
            </div>
        </div>
    )
};

export default ProfileInfoLoadingSkeleton;