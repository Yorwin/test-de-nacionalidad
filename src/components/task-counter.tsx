import styles from "@/styles/components/task-counter.module.scss";

const TaskControl = ({ taskCounter }: { taskCounter: number }) => {
    return <>
        <div className={styles["task-control-container"]}>
            <h2>Tarea {`${taskCounter + 1}/5`}</h2>
        </div>
    </>
};

export default TaskControl;