"use client"

import { useEffect, useState } from "react";
import styles from "@/styles/layout/profile/blockstats.module.scss";

/* Components */
import DayStreak from "./components/day-streak-block";
import LongestDayStreak from "./components/longest-day-streak";
import Experience from "./components/experience";

/* Context */
import { useAuth } from "@/context/auth-context";

/* Loading Skeleton */
import LoadingSkeleton from "./cards-loading.skeleton";

const BlockStat = () => {

    const { userData, loading: authLoading } = useAuth();

    const [userId, setUserId] = useState("");
    const [experience, setExperience] = useState(0);

    useEffect(() => {
        if (!userData) {
            return
        }

        setUserId(userData.uid)
        setExperience(userData.experience);
    }, [userData])

    if (authLoading) {
        return (
            <div className={styles["main-container"]}>
                <LoadingSkeleton />
                <LoadingSkeleton />
                <LoadingSkeleton />
            </div>
        )
    }

    return <>
        <div className={styles["main-container"]}>
            <DayStreak userId={userId} />
            <Experience experience={experience} loading={authLoading} />
            <LongestDayStreak userId={userId} />
        </div>
    </>
};

export default BlockStat;