import styles from "@/styles/layout/settings/recover-password-email-sent.module.scss";

interface RecoverPasswordProps {
    toggleConfirmationPasswordMesage: () => void,
    loadingState: boolean,
}

const RecoverPasswordEmailSent = ({ toggleConfirmationPasswordMesage, loadingState }: RecoverPasswordProps) => {
    return (
        <div className={styles["main-container"]}>
            <div className={styles["message-container"]}>
                {loadingState ? <h2>Enviando correo...</h2> : <div className={styles["content"]}>
                    <i className="bi bi-envelope-check-fill"></i>
                    <h2> Correo enviado </h2>
                    <p> Te hemos enviado un correo con las instrucciones para restablecer tu contraseña.</p>
                    <p> Por favor, revisa tu bandeja de entrada y también la carpeta de spam. </p>
                    <button className={styles["button-confirm"]} onClick={toggleConfirmationPasswordMesage}>Vale</button>
                </div>}
                <div className={styles["close-icon"]}>
                    <button onClick={toggleConfirmationPasswordMesage}>
                        <i className="bi bi-x-square"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecoverPasswordEmailSent;