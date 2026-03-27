import { MetadataRoute } from 'next'
import { db } from '@/db'
import { products } from '@/db/schema'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://agt-group.com'
  
  // Static routes
  const staticRoutes = ['', '/products', '/projects', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === "" ? 1.0 : 0.8,
  }))

  // Dynamic product routes
  const allProducts = await db.select().from(products)
  const productRoutes = allProducts.map((p) => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: p.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes]
}
