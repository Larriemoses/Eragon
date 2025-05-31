// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import prerender from 'vite-plugin-prerender';
// REMOVE THIS LINE: import fetch from 'node-fetch';
import { slugify } from './src/utils/slugify';

interface ProductForPrerender {
  id: number;
  name: string;
}

slugify 
resolve
type ApiResponse = {
  results?: ProductForPrerender[];
} | ProductForPrerender[];

export default defineConfig({
  plugins: [
    react(),
    prerender(
      {
        puppeteer: { headless: 'new' }, // 'new' is often recommended for modern Puppeteer

        async getRoutes() {
          const staticRoutes = [
            '/',
            '/stores',
            '/submit-store',
            '/contact',
            '/terms-of-service',
            '/privacy',
            '/affiliate-disclosure',
          ];

          let productsRes: Response | undefined; // Now refers to the global Response type

          try {
            // 'fetch' here will implicitly refer to the global Node.js native fetch
            productsRes = await fetch('https://eragon-backend1.onrender.com/api/products/');
            if (!productsRes.ok) {
              console.error(`Failed to fetch products for prerendering: HTTP error! status: ${productsRes.status}`);
              return staticRoutes;
            }

            const apiResponse = (await productsRes.json()) as ApiResponse;
            const products: ProductForPrerender[] = Array.isArray(apiResponse)
              ? apiResponse
              : (apiResponse as { results?: ProductForPrerender[] }).results || [];

            const productRoutes = products.map((p: ProductForPrerender) => `/store/<span class="math-inline">\{p\.id\}/</span>{slugify(p.name)}/`);
            return [...staticRoutes, ...productRoutes];

          } catch (error) {
            console.error('Error fetching dynamic routes for prerendering:', error);
            if (productsRes && productsRes.status) {
              console.error(`Fetch error status: ${productsRes.status}`);
            }
            return staticRoutes;
          }
        },
        sitemap: {
          hostname: 'https://discountregion.com',
        },
      } as any // Keep this 'as any' for now if the 'puppeteer' error persists,
             // otherwise remove it if the build works without it.
    ),
  ],
  build: {
    outDir: 'dist',
  },
});