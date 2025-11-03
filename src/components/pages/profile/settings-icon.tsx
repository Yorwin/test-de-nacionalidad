"use client"

import { useRouter } from "next/navigation";
import styles from "@/styles/layout/profile/settings-icon.module.scss";

const SettingsIcon = () => {

    const router = useRouter();

    const goToSettings = () => {
        router.replace("/settings");
    };

    return (
        <button className={styles["settings-button"]} onClick={goToSettings}>
            <i className="bi bi-gear-wide-connected"></i>
        </button>
    )
};

export default SettingsIcon;