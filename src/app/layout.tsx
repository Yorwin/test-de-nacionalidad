import type { Metadata } from "next";
import { ElmsSans, ElmsSansItalic, Montaga } from "@/lib/fonts";

/* Estilos Globales */
import "./globals.css";
import "./skeleton.scss";

/* Bootstrap */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

/* Context */
import { ThemeProvider } from "@/context/theme-context";

export const metadata: Metadata = {
  title: "Prepárate CCSE | Practica el examen de nacionalidad española",
  description:
    "Realiza test y ejercicios prácticos para el examen CCSE del Instituto Cervantes. Mejora tus resultados y obtén tu nacionalidad española con nuestra ayuda.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://preparateccse.com/",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-96x96.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Prepárate CCSE | Examen de nacionalidad española",
    description:
      "Practica con preguntas reales del examen CCSE y obtén tu nacionalidad española. Simulacros, resultados y consejos actualizados.",
    url: "https://preparateccse.com/",
    siteName: "Prepárate CCSE",
    images: [
      {
        url: "https://preparateccse.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Practica el examen de nacionalidad española CCSE",
      },
    ],
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prepárate CCSE | Examen de nacionalidad española",
    description:
      "Practica el examen CCSE del Instituto Cervantes y mejora tus resultados con nuestra app.",
    images: ["https://preparateccse.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${ElmsSans.variable} ${ElmsSansItalic.variable} ${Montaga.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
