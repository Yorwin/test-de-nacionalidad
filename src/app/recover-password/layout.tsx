import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Recuperar Contraseña | Prepárate CCSE',
    description: 'Restablece tu contraseña de forma segura en Prepárate CCSE.',
    alternates: {
        canonical: 'https://prepárateccse.com/recover-password',
    },
    robots: {
        index: false,
        follow: false,
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}