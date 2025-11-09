import styles from "@/styles/layout/terminos-y-condiciones/terminos-y-condiciones.module.scss";

/* Components */
import Logo from "@/components/logo-cervantes";
import ProfileSection from "@/components/profile-section/profile-section";

const TermsAndConditions = () => {
    return (
        <div className={styles["terms-and-conditions-container"]}>
            <header className={styles["header"]}>
                <Logo />
                <ProfileSection />
            </header>
            <div className={styles["content"]}>
                <h1>Terminos y Condiciones</h1>
                <section>
                    <p>Contenido</p>
                </section>
                <section>
                    <p>Contenido</p>
                </section>
            </div>
        </div>
    )
};

export default TermsAndConditions;