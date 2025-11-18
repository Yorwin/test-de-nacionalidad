import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Simulación de Prueba | Prepárate CCSE',
    description: 'Realiza un simulacro completo del examen CCSE con preguntas reales y cronómetro. Practica y mejora tus resultados con nuestro test oficial.',
    alternates: {
        canonical: 'https://prepárateccse.com/simulacion-de-prueba',
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