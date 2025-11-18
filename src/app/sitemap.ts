import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://preparateccse.com'

    const routes = [
        { route: '', priority: 1.0, changeFrequency: 'weekly' as const },
        { route: 'ajustes', priority: 0.5, changeFrequency: 'monthly' as const },
        { route: 'autorizacion/iniciar-sesion', priority: 0.8, changeFrequency: 'monthly' as const },
        { route: 'autorizacion/registrarse', priority: 0.8, changeFrequency: 'monthly' as const },
        { route: 'perfil', priority: 0.6, changeFrequency: 'monthly' as const },
        { route: 'practica-por-modulo', priority: 0.9, changeFrequency: 'weekly' as const },
        { route: 'practica-por-modulo/simulacion/1', priority: 0.7, changeFrequency: 'weekly' as const },
        { route: 'practica-por-modulo/simulacion/2', priority: 0.7, changeFrequency: 'weekly' as const },
        { route: 'practica-por-modulo/simulacion/3', priority: 0.7, changeFrequency: 'weekly' as const },
        { route: 'practica-por-modulo/simulacion/4', priority: 0.7, changeFrequency: 'weekly' as const },
        { route: 'practica-por-modulo/simulacion/5', priority: 0.7, changeFrequency: 'weekly' as const },
        { route: 'recomendaciones', priority: 0.6, changeFrequency: 'monthly' as const },
        { route: 'recover-password', priority: 0.4, changeFrequency: 'yearly' as const },
        { route: 'resultados', priority: 0.8, changeFrequency: 'weekly' as const },
        { route: 'simulacion-de-prueba', priority: 0.9, changeFrequency: 'weekly' as const },
        { route: 'terminos-y-condiciones', priority: 0.3, changeFrequency: 'yearly' as const },
    ]

    return routes.map(({ route, priority, changeFrequency }) => ({
        url: `${baseUrl}${route ? `/${route}` : ''}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }))
}