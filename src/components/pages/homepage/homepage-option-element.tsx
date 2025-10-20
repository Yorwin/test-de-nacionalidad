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
        <div className="col-md-6 col-sm-12 my-5">
            <div className={styles["contenedor-opcion"]}>
                <i className={icono}></i>
                <div className={styles["contenedor-texto"]}>
                    <Link href={enlace}>
                        <h3>{titulo}</h3>
                        <p>{descripcion}</p>
                    </Link>
                </div>
            </div>
        </div>
    </>
};

export default HomePageOptionElement;