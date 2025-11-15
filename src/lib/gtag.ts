declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-XNSFCLMNH6";

// Registrar vista de página
export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}