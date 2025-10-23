import { useCounter } from "@/context/counter-simulacion-prueba";
import styles from "@/styles/layout/simulacion-de-prueba/counter-simulacion-prueba.module.scss";

const Counter = () => {
    const { getFormatedTime } = useCounter();

    return <>
        <div className={styles["counter-main-container"]}>
            <h2>{getFormatedTime()}</h2>
        </div>
    </>
};

export default Counter;