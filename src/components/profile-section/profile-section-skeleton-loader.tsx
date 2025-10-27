import styles from "@/styles/components/profile-section.module.scss";

const ProfileSectionSkeletonLoader = () => {
    return (
        <div className={styles["profile-info-container"]}>
            <div className={styles["profie-image-container"]}>
                <div className={`skeleton-circle ${styles["profile-image"]}`}></div>
            </div>
            <div className={styles["skeleton-profile-info-section"]}>
                <div className={`skeleton-rect ${styles["profile-info"]}`}></div>
                <div className={`skeleton-rect ${styles["profile-info"]}`}></div>
            </div>
        </div>
    )
};

export default ProfileSectionSkeletonLoader;