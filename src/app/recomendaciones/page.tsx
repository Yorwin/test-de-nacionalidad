import styles from "@/styles/layout/recomendaciones/recomendaciones.module.scss";
import TituloGenerico from "@/components/generic-title";
import ArrowGoBack from "@/components/arrow-go-back";
import Link from 'next/link';

const Recommendations = () => {
    return <>
        <div className="container-fluid">
            <div className={styles["main-container"]}>
                <div className={styles["header-container"]}>
                    <TituloGenerico titulo="Recomendaciones" />
                    <Link href={"/"}>
                        <ArrowGoBack />
                    </Link>
                </div>
                <div className={styles["container-content"]}>
                    <h2>Prueba CCSE</h2>
                    <ul className={styles["list-recommendations"]}>
                        <li>
                            <i className="bi bi-globe2"></i>
                            <a href="https://examenes.cervantes.es/es/ccse/preparar-prueba" target="_blank">Preparar la prueba CCSE</a>
                        </li>
                        <li>
                            <i className="bi bi-globe2"></i>
                            <a href="https://examenes.cervantes.es/es/ccse/quien" target="_blank">Candidatos con necesidades especiales</a>
                        </li>
                        <li>
                            <i className="bi bi-globe2"></i>
                            <a href="https://examenes.cervantes.es/es/ccse/preguntas-frecuentes" target="_blank">Preguntas frecuentes</a>
                        </li>
                        <li>
                            <i className="bi bi-globe2"></i>
                            <a href="https://examenes.cervantes.es/es/ccse/que-es" target="_blank">Más información sobre la prueba</a>
                        </li>
                    </ul>

                    <p className={styles["informacion-manual"]}>
                        <i className="bi bi-info-circle"></i>
                        Incorporadas en esta versión las preguntas del manual 2025
                    </p>
                </div>
            </div>
        </div>
    </>
};

export default Recommendations;