import styles from "@/styles/layout/auth-pages/auth-image.module.scss";
import Imagersc from "@/resources/foto-auth.jpg";
import Image from "next/image";
import TypeOfButton from "./type-of-button";

const AuthImage = () => {
    return (
        <div className={styles["image-container"]}>
            <Image
                src={Imagersc}
                alt="Imagen Presentacion"
                className={styles["presentation-image"]}
                priority
                sizes="50vw"
                fill
            />
            <div className={styles["image-container-button"]}>
                <TypeOfButton />
            </div>
            <div className={styles["image-band"]}>
                <i className="bi bi-journals"></i>
                <small>Sitio web para la preparación del Examen CCSE</small>
            </div>
        </div>
    )
};

export default AuthImage;