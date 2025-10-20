import styles from "@/styles/components/terms-and-conditions.module.scss";

const TermsAndConditions = () => {
    return <>
        <div className={styles["terms-and-conditions-container"]}>
            <a href="#" className={styles["terms-and-conditions"]}>
                <small>Terminos y Condiciones legales</small>
            </a>
        </div>
    </>
}

export default TermsAndConditions;