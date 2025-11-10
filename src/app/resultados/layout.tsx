import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Resultados | Prepárate CCSE',
    description: 'Consulta tus resultados y progreso en los test y simulaciones de Prepárate CCSE. Analiza tu rendimiento y mejora tus resultados para preparar el examen de nacionalidad española.',
    alternates: {
        canonical: 'https://preparateccse.com/resultados',
    },
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: 'Resultados | Prepárate CCSE',
        description: 'Consulta tus resultados y progreso en los test y simulaciones de Prepárate CCSE. Analiza tu rendimiento y mejora tus resultados.',
        url: 'https://preparateccse.com/resultados',
        images: [
            {
                url: 'https://preparateccse.com/og-resultados.jpg',
                width: 1200,
                height: 630,
                alt: 'Resultados de test CCSE',
            },
        ],
        type: 'website',
        locale: 'es_ES',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Resultados | Prepárate CCSE',
        description: 'Consulta tus resultados y progreso en los test y simulaciones de Prepárate CCSE.',
        images: ['https://preparateccse.com/og-resultados.jpg'],
    }
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}