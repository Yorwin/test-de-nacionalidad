import styles from "@/styles/layout/homepage/homepage-option-element.module.scss";
import Link from "next/link";

type HomePageProps = {
    icono: string;
    titulo: string;
    descripcion: string;
    enlace: string;
};

const HomePageOptionElement = ({ icono, titulo, descripcion, enlace }: HomePageProps) => {
    return <>
        <div className="col-md-6 col-sm-12 my-lg-5 my-md-4 my-sm-3">
            <div className={styles["contenedor-opcion"]}>
                <Link className={styles["link"]} href={enlace}>
                    <i className={icono}></i>
                    <div className={styles["contenedor-texto"]}>
                        <h3>{titulo}</h3>
                        <p>{descripcion}</p>
                    </div>
                </Link>
            </div>
        </div>
    </>
};

export default HomePageOptionElement;