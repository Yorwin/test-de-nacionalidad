import styles from "@/styles/components/terms-and-conditions.module.scss";
import Link from "next/link";

const TermsAndConditions = () => {
    return <>
        <div className={styles["terms-and-conditions-container"]}>
            <Link href="/terminos-y-condiciones" className={styles["terms-and-conditions"]}>
                <small>Terminos y Condiciones legales</small>
            </Link>
        </div>
    </>
}

export default TermsAndConditions;