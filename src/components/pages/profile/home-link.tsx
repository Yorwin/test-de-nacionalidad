"use client"

import { useRouter } from "next/navigation";
import styles from "@/styles/layout/profile/home-link.module.scss";

const HomeLink = () => {

    const router = useRouter();

    const goHome = () => {
        router.replace("/")
    };

    return (
        <button className={styles["home-icon-container"]} onClick={goHome}>
            <i className="bi bi-house-door-fill"></i>
        </button>
    )
};

export default HomeLink;