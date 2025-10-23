import styles from '@/styles/components/arrow-go-back.module.scss';

const ArrowGoBack = () => {
    return <>
        <div className={styles["container-icon"]}>
            <i className="bi bi-arrow-left"></i>
        </div>
    </>
}

export default ArrowGoBack;