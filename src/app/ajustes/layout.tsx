import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Ajustes | Prepárate CCSE',
    description: 'Configura tu experiencia en Prepárate CCSE: ajusta tus preferencias de usuario, notificaciones y opciones de práctica para sacar el máximo provecho a tu preparación del examen de nacionalidad española.',
    alternates: {
        canonical: 'https://prepárateccse.com/ajustes',
    },
    robots: {
        index: false,
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