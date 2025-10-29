import styles from "@/styles/layout/homepage/homepage.module.scss";

/* Componentes */
import Logo from "@/components/logo-cervantes"
import ProfileSection from "@/components/profile-section/profile-section";
import HomePageOptionElement from "@/components/pages/homepage/homepage-option-element";
import TermsAndConditions from "@/components/terms-and-conditions";

const HomePage = () => {
  return (
    <div className={styles["main-container"]}>
      <div className={styles["header-content"]}>
        <Logo />
        <ProfileSection />
      </div>
      <div className="container-lg mx-0 my-5 py-md-5">
        <div className="row">
          <HomePageOptionElement icono="bi bi-display" titulo="Simulación de Prueba" descripcion="Reduce ansiedad, mejora tiempo, identifica fallos, refuerza aprendizaje, y aumenta confianza." enlace={"/simulacion-de-prueba"} />
          <HomePageOptionElement icono="bi bi-book" titulo="Práctica por módulo" descripcion="Permite practicar por separado, mejorar puntos débiles, y avanzar a tu ritmo." enlace={"/practica-por-modulo"} />
          <HomePageOptionElement icono="bi bi-bar-chart-line-fill" titulo="Resultados" descripcion="Identifica fortalezas y debilidades, mide progreso, optimiza estudio, y enfoca mejoras." enlace={"/resultados"} />
          <HomePageOptionElement icono="bi bi-info-circle" titulo="Recomendaciones" descripcion="Reduce ansiedad, mejora tiempo, identifica fallos, refuerza aprendizaje y aumenta confianza." enlace={"/recomendaciones"} />
        </div>
      </div>
      <div className={styles["footer-content"]}>
        <TermsAndConditions />
        <h2>Prueba <br /> CCSE</h2>
      </div>
    </div>
  )
};

export default HomePage;