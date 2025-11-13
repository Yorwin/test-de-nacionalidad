import styles from "@/styles/layout/homepage/homepage.module.scss";
import Link from "next/link";

/* Componentes */
import Logo from "@/components/logo-cervantes"
import ProfileSection from "@/components/profile-section/profile-section";
import HomePageOptionElement from "@/components/pages/homepage/homepage-option-element";

const HomePage = () => {
  return (
    <div className={styles["main-container"]}>
      <div></div>
      <div className={styles["header-content"]}>
        <Logo />
        <ProfileSection />
      </div>
      <div className="container-lg mx-0 mb-5">
        <h1 className={styles["homepage-title"]}>LA MEJOR HERRAMIENTA PARA APROBAR TU EXAMÉN DE NACIONALIDAD ESPAÑOLA</h1>
        <div className="row">
          <HomePageOptionElement icono="bi bi-display" titulo="Simulación de Prueba" descripcion="Reduce ansiedad, mejora tiempo, identifica fallos, refuerza aprendizaje, y aumenta confianza." enlace={"/simulacion-de-prueba"} />
          <HomePageOptionElement icono="bi bi-book" titulo="Práctica por módulo" descripcion="Permite practicar por separado, mejorar puntos débiles, y avanzar a tu ritmo." enlace={"/practica-por-modulo"} />
          <HomePageOptionElement icono="bi bi-bar-chart-line-fill" titulo="Resultados" descripcion="Identifica fortalezas y debilidades, mide progreso, optimiza estudio, y enfoca mejoras." enlace={"/resultados"} />
          <HomePageOptionElement icono="bi bi-info-circle" titulo="Recomendaciones" descripcion="Reduce ansiedad, mejora tiempo, identifica fallos, refuerza aprendizaje y aumenta confianza." enlace={"/recomendaciones"} />
        </div>
      </div>
      <div className={styles["footer-content"]}>
        <div className={styles["footer-info"]}>

          {/* Terminos y Condiciones */}
          <Link href="/terminos-y-condiciones" className={styles["footer-link"]}>
            <small>Terminos y Condiciones legales</small>
          </Link>

          {/* Contacto */}
          <a href="mailto:info@testpruebaccse.com" className={styles["footer-link"]}>
            <small>Contacto: <strong>info@testpruebaccse.com</strong></small>
          </a>

          {/* Preguntas */}
          <div className={styles["questions-disclaimer"]}>
            <i className="bi bi-info-circle"></i>
            <h3>Incorporadas las preguntas del manual 2025</h3>
          </div>
        </div>
        <h2>Prueba <br /> CCSE</h2>
      </div>
    </div>
  )
};

export default HomePage;