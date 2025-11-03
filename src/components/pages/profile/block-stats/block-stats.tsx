import styles from "@/styles/layout/profile/blockstats.module.scss";
import DayStreak from "./components/day-streak-block";
import LongestDayStreak from "./components/longest-day-streak";
import Experience from "./components/experience";
import { auth } from "@/firebase/firebase";

const BlockStat = () => {

    const user = auth.currentUser;

    if (!user) {
        return (
            <h3>No hay usuario para mostrar...</h3>
        )
    }

    return <>
        <div className={styles["main-container"]}>
            <DayStreak userId={user.uid} />
            <Experience userId={user.uid} />
            <LongestDayStreak userId={user.uid} />
        </div>
    </>
};

export default BlockStat;