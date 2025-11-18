import type { Metadata } from "next";

/* Componentes */
import Logo from "@/components/logo-cervantes";
import TermsAndConditions from "@/components/terms-and-conditions";
import AuthImage from "@/components/pages/auth-pages/auth-image";

/* Styles */
import styles from "@/styles/layout/auth-pages/auth-pages.module.scss";

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata: Metadata = {
    title: 'Identificación | Prepárate CCSE',
    description: 'Accede a tu cuenta de Prepárate CCSE o crea una nueva. Guarda tu progreso, realiza test, y aprovecha al máximo nuestra app para preparar el examen de nacionalidad española.',
    alternates: {
        canonical: 'https://prepárateccse.com/autorizacion',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles["authorization-pages-container"]}>
            <div className={styles["logo-container"]}>
                <Logo />
            </div>
            <div className={styles["content-container"]}>
                {children}
                <TermsAndConditions />
            </div>
            <AuthImage />
        </div>
    );
}