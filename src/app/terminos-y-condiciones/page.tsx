import styles from "@/styles/layout/terminos-y-condiciones/terminos-y-condiciones.module.scss";
import Link from "next/link";

/* Components */
import Logo from "@/components/logo-cervantes";
import ProfileSection from "@/components/profile-section/profile-section";
import TextBlockItem from "@/components/pages/terms-and-conditions/text-block-item";

const TermsAndConditions = () => {

    const TermsAndConditionsContent = [
        {
            "titulo": "Objeto y aceptación",
            "contenido": "El presente documento regula el uso de la aplicación web PreparateCCSE (en adelante, “la App” o “el sitio”), desarrollada y gestionada por Yorwin José Rosales Castellanos, como persona física. El acceso y uso de la App implica la aceptación plena y sin reservas de estos Términos y Condiciones de Uso. Si el usuario no está de acuerdo con ellos, deberá abstenerse de utilizar el servicio."
        },
        {
            "titulo": "Descripción del servicio",
            "contenido": "PreparateCCSE es una aplicación web que permite a los usuarios practicar y prepararse para el examen CCSE (Conocimientos Constitucionales y Socioculturales de España), gestionado por el Instituto Cervantes. La App ofrece funcionalidades como simulacros de examen, estadísticas personales, repaso de preguntas y recomendaciones, con el fin de apoyar el aprendizaje del usuario. Los contenidos de los cuestionarios se basan en las preguntas oficiales publicadas por el Instituto Cervantes, actualizadas manualmente conforme al manual oficial vigente."
        },
        {
            "titulo": "Registro de usuario",
            "contenido": "El uso básico de la App es gratuito y puede realizarse sin necesidad de registro. No obstante, los usuarios pueden crear una cuenta personal para guardar su progreso, resultados y estadísticas. Para registrarse, se solicitarán los siguientes datos: nombre, correo electrónico y contraseña. El usuario será responsable de mantener la confidencialidad de sus credenciales de acceso y del uso correcto de su cuenta."
        },
        {
            "titulo": "Condiciones de uso",
            "contenido": "El usuario se compromete a hacer un uso diligente, correcto y lícito de la App, absteniéndose de: Utilizar los contenidos o servicios con fines ilícitos o contrarios a la buena fe. Introducir o difundir virus o software malicioso que pueda dañar los sistemas de la App o de terceros. Suplantar la identidad de otras personas o acceder a cuentas ajenas sin autorización. El incumplimiento de estas condiciones podrá dar lugar a la suspensión o eliminación de la cuenta."
        },
        {
            "titulo": "Propiedad intelectual e industrial",
            "contenido": "El código fuente, diseño, estructura, textos, recomendaciones, logotipo y nombre comercial PreparateCCSE son propiedad de Yorwin José Rosales Castellanos y están protegidos por la normativa de propiedad intelectual e industrial española. Queda prohibida su reproducción, distribución o modificación total o parcial sin autorización expresa por escrito. Las preguntas del examen CCSE reproducidas en la App pertenecen al Instituto Cervantes, y se utilizan únicamente con fines educativos y de práctica, respetando su carácter oficial y sin propósito comercial directo."
        },
        {
            "titulo": "Privacidad y protección de datos",
            "contenido": "El tratamiento de los datos personales de los usuarios se rige por la Política de Privacidad, disponible desde la misma App. Los datos recogidos (nombre y correo electrónico) se utilizan exclusivamente para la creación de cuentas, registro de progreso y funcionalidades estadísticas. Los datos se almacenan en Firebase (Google Cloud Platform). Se emplean servicios de terceros como Google Analytics y Google AdSense para fines de analítica y publicidad, respetando en todo momento la legislación vigente (Reglamento UE 2016/679 y Ley Orgánica 3/2018). El usuario puede eliminar su cuenta y sus datos personales en cualquier momento mediante el botón disponible en su perfil o contactando por correo electrónico."
        },
        {
            "titulo": "Publicidad y enlaces a terceros",
            "contenido": "La App puede mostrar banners publicitarios y enlaces a sitios externos, como el Instituto Cervantes, videos de YouTube u otros recursos educativos o de socios colaboradores. El titular no se responsabiliza del contenido, políticas o disponibilidad de dichos sitios de terceros, ni de los daños o perjuicios que pudieran derivarse de su acceso o uso."
        },
        {
            "titulo": "Responsabilidad y limitación de garantías",
            "contenido": "La App PreparateCCSE ofrece simulacros y materiales de práctica con carácter orientativo, sin constituir asesoramiento oficial ni garantía de éxito en el examen real. El titular no garantiza la ausencia de errores en los contenidos o su actualización inmediata, aunque se compromete a revisarlos periódicamente. No se asume responsabilidad por interrupciones del servicio, pérdidas de datos o daños derivados del uso indebido del sitio. Para incidencias técnicas o consultas, los usuarios pueden contactar al correo yorwinr56@gmail.com, disponible 24 horas."
        },
        {
            "titulo": "Contratación y pagos",
            "contenido": "Actualmente, la App no ofrece servicios de pago, suscripciones ni compras integradas. El acceso a todas sus funcionalidades es completamente gratuito. En caso de incorporar servicios de pago en el futuro, se actualizarán los presentes Términos y se informará debidamente a los usuarios."
        },
        {
            "titulo": "Legislación aplicable y jurisdicción",
            "contenido": "Los presentes Términos se rigen por la legislación española, en particular por la Ley 34/2002, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE) y la Ley Orgánica 3/2018 (LOPDGDD). Cualquier disputa o conflicto derivado de su interpretación o aplicación se resolverá conforme a la normativa vigente y los órganos judiciales competentes en España."
        },
        {
            "titulo": "Modificaciones y vigencia",
            "contenido": "El titular se reserva el derecho de modificar en cualquier momento los presentes Términos y Condiciones, notificando a los usuarios mediante su publicación en la App. El uso continuado del servicio tras la modificación implica la aceptación de la nueva versión. Los presentes Términos permanecerán vigentes mientras la App esté activa y accesible."
        },
        {
            "titulo": "Aceptación de los términos",
            "contenido": "El uso de la App PreparateCCSE implica la aceptación plena y expresa de estos Términos y Condiciones. Se considerará que el usuario los acepta desde el momento en que accede y utiliza cualquiera de las funcionalidades disponibles en la plataforma."
        }
    ];

    const TermsContent = TermsAndConditionsContent.map((e: any, index: number) => {
        return (
            <TextBlockItem key={index} number={index + 1} title={e.titulo} text={e.contenido} />
        )
    });

    const PoliticaDePrivacidadContent = [
        {
            "titulo": "Responsable del tratamiento",
            "contenido": "El responsable del tratamiento de los datos personales es Yorwin José Rosales Castellanos, persona física, titular de la App PreparateCCSE. Cualquier consulta sobre datos personales puede realizarse mediante correo electrónico a yorwinr56@gmail.com."
        },
        {
            "titulo": "Datos personales que se recogen",
            "contenido": "Para el correcto funcionamiento de la App, se recogen únicamente los siguientes datos personales: Nombre del usuario, Correo electrónico y Contraseña (almacenada de manera segura y cifrada). Estos datos permiten al usuario registrarse, guardar su progreso, recibir recomendaciones personalizadas y acceder a estadísticas de uso."
        },
        {
            "titulo": "Finalidad del tratamiento",
            "contenido": "Los datos personales se utilizan exclusivamente para los siguientes fines: 1) Gestión de cuentas de usuario: creación y acceso a la App; 2) Seguimiento del progreso y estadísticas: registro del avance del usuario en simulacros y pruebas; 3) Mejora del servicio: análisis de uso mediante herramientas de analítica (Google Analytics) para optimizar la App; 4) Publicidad limitada: mediante Google AdSense, respetando la normativa de protección de datos."
        },
        {
            "titulo": "Base legal del tratamiento",
            "contenido": "El tratamiento de los datos se realiza sobre la base de: Consentimiento explícito del usuario al registrarse en la App y Legítimo interés del responsable para mejorar el servicio y gestionar estadísticas internas, siempre respetando la privacidad del usuario."
        },
        {
            "titulo": "Destinatarios y transferencia de datos",
            "contenido": "Los datos personales no se venden ni ceden a terceros. Se pueden utilizar los siguientes servicios externos, cumpliendo con la normativa vigente: Firebase (Google Cloud Platform) para almacenamiento y gestión segura de datos, Google Analytics para analítica de uso y Google AdSense para publicidad contextual. No se realizan transferencias internacionales de datos fuera de la UE salvo que los proveedores cumplan con el RGPD."
        },
        {
            "titulo": "Conservación de los datos",
            "contenido": "Los datos se conservarán mientras el usuario mantenga activa su cuenta. El usuario puede solicitar la eliminación completa de sus datos en cualquier momento mediante el botón de eliminación de datos disponible en la App o contactando al correo del responsable."
        },
        {
            "titulo": "Derechos del usuario",
            "contenido": "Los usuarios tienen los siguientes derechos, garantizados por la LOPDGDD y el RGPD: Acceso (conocer qué datos se están tratando), Rectificación (corregir datos inexactos o incompletos), Supresión (eliminar los datos personales), Limitación del tratamiento (restringir el uso de los datos en determinadas situaciones), Portabilidad (recibir los datos en un formato estructurado y legible), Oposición (oponerse al tratamiento de datos por motivos legítimos). Para ejercer estos derechos, el usuario puede enviar un correo a yorwinr56@gmail.com."
        },
        {
            "titulo": "Seguridad de los datos",
            "contenido": "El responsable aplica medidas técnicas y organizativas apropiadas para garantizar la confidencialidad, integridad y disponibilidad de los datos, incluyendo: almacenamiento cifrado de contraseñas, servidores seguros en Firebase, control de acceso restringido a datos de usuario."
        },
        {
            "titulo": "Cookies y tecnologías similares",
            "contenido": "La App utiliza Google Analytics para analizar el comportamiento de los usuarios y optimizar el servicio. Además, se pueden mostrar anuncios mediante Google AdSense, que pueden usar cookies para publicidad contextual. Los usuarios pueden gestionar su consentimiento y desactivar cookies mediante la configuración de su navegador."
        },
        {
            "titulo": "Cambios en la política de privacidad",
            "contenido": "El titular se reserva el derecho de modificar esta Política de Privacidad para adaptarla a cambios legales, técnicos o del servicio. Cualquier actualización será publicada en la App, indicando la fecha de última revisión. El uso continuado de la App tras las modificaciones implica la aceptación de la nueva política."
        }
    ];


    const PoliticaDePrivacidad = PoliticaDePrivacidadContent.map((e: any, index: number) => {
        return (
            <TextBlockItem key={index} number={index + 1} title={e.titulo} text={e.contenido} />
        )
    });

    return (
        <div className={styles["terms-and-conditions-container"]}>
            <header className={styles["header"]}>
                <Logo />
                <ProfileSection />
            </header>
            <div className={styles["content"]}>
                <nav className={styles["nav"]}>
                    <Link href={"#terminos-y-condiciones"}>Términos y Condiciones</Link>
                    <small>/</small>
                    <Link href={"#politica-de-privacidad"}>Política de Privacidad</Link>
                </nav>
                <article id="terminos-y-condiciones">
                    <h1 className={styles["main-section-title"]}>Términos y Condiciones</h1>
                    <section className="section-intro">
                        <ul className={styles["list"]}>
                            <li>
                                <h3>Versión vigente desde:</h3>
                                <p> 10 de noviembre de 2025</p>
                            </li>
                            <li>
                                <h3>Titular:</h3>
                                <p> Yorwin José Rosales Castellanos (NIE: Y9911885A)</p>
                            </li>
                            <li>
                                <h3>Correo de contacto:</h3>
                                <p>yorwinr56@gmail.com</p>
                            </li>
                            <li>
                                <h3>Nombre comercial / App:</h3>
                                <p>PreparateCCSE</p>
                            </li>
                        </ul>
                    </section>
                    {TermsContent}
                </article>
                <article id="politica-de-privacidad">
                    <h1 className={styles["main-section-title"]}>Política de Privacidad</h1>
                    <section className="section-intro">
                        <ul className={styles["list"]}>
                            <li>
                                <h3>Última actualización:</h3>
                                <p> 10 de Noviembre de 2025</p>
                            </li>
                            <li>
                                <h3>Titular:</h3>
                                <p> Yorwin José Rosales Castellanos (NIE: Y9911885A)</p>
                            </li>
                            <li>
                                <h3>Correo de contacto:</h3>
                                <p> yorwinr56@gmail.com</p>
                            </li>
                        </ul>
                    </section>
                    {PoliticaDePrivacidad}
                </article>
            </div>
        </div>
    )
};

export default TermsAndConditions;