import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Práctica por Módulo | Prepárate CCSE',
    description: 'Mejora tu preparación del examen CCSE practicando preguntas por módulo. Realiza test y simulaciones con seguimiento de tu progreso en Prepárate CCSE.',
    alternates: {
        canonical: 'https://prepárateccse.com/practica-por-modulo',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}