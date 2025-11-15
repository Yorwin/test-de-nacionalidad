import styles from "@/styles/layout/homepage/homepage.module.scss";
import Link from "next/link";

/* Componentes */
import Logo from "@/components/logo-cervantes"
import ProfileSection from "@/components/profile-section/profile-section";
import HomePageOptionElement from "@/components/pages/homepage/homepage-option-element";
import AdminUploadQuestions from "@/components/pages/homepage/admin-upload-questions";

/* Context */
import { AuthProvider } from "@/context/auth-context";

const HomePage = () => {
  return (
    <div className={styles["main-container"]}>
      <div></div>
      <div className={styles["header-content"]}>
        <Logo />
        <ProfileSection />
      </div>
      <div className="container-lg mx-0 my-3">
        <h1 className={styles["homepage-title"]}>LA MEJOR HERRAMIENTA PARA APROBAR TU EXAMÉN DE NACIONALIDAD ESPAÑOLA</h1>
        <p className={styles["parrafo"]}>Prepárate fácilmente para el examen de nacionalidad española (CCSE) del Instituto Cervantes. Accede a tests de nacionalidad, simulacros y preguntas del examen para estudiar. Nuestra plataforma te ayuda a comprender los contenidos oficiales y practicar con ejercicios reales para acercarte a tu objetivo de obtener la nacionalidad española.</p>
        <div className="row">
          <HomePageOptionElement icono="bi bi-display" titulo="Simulación de Prueba" descripcion="Simula el examen de nacionalidad española (CCSE) con un test de 25 minutos y preguntas actualizadas para evaluar tu preparación real." enlace={"/simulacion-de-prueba"} />
          <HomePageOptionElement icono="bi bi-book" titulo="Práctica por módulo" descripcion="Muestra tu porcentaje de preparación por módulo, ofreciéndote una visión de lo que ya dominas y lo que necesitas revisar." enlace={"/practica-por-modulo"} />
          <HomePageOptionElement icono="bi bi-bar-chart-line-fill" titulo="Resultados" descripcion="Ve tus resultados del test de nacionalidad española (CCSE). Revisa tu porcentaje de aciertos, tu rendimiento y tus respuestas correctas e incorrectas para analizar tu progreso." enlace={"/resultados"} />
          <HomePageOptionElement icono="bi bi-info-circle" titulo="Recomendaciones" descripcion="Mejora tu preparación para el examen de nacionalidad española (CCSE) con recomendaciones prácticas que hacen tu estudio más cómodo, organizado y adaptado a tu ritmo." enlace={"/recomendaciones"} />
        </div>
        <AuthProvider>
          <AdminUploadQuestions />
        </AuthProvider>
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