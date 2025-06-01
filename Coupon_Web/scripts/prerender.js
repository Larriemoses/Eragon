// scripts/prerender.js
// This script will run in Node.js after your Vite build.
// It will launch a server, use Playwright to visit routes,
// and save the HTML, then generate a sitemap.

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite'; // To run Vite build before serving
import { preview } from 'vite'; // To serve the built app locally
import playwright from 'playwright'; // Import Playwright
// import fetch from 'node-fetch'; // For fetching product data for dynamic routes

// Define the slugify function (copy from your src/utils/slugify.ts)
// Or import it if you configure Node.js to read TS/ESM from src/
// For simplicity, let's include it here as a JS function.
const slugify = (text) => {
  if (!text) return '';
  return String(text)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); // Points to Coupon_Web root
const distDir = path.join(projectRoot, 'dist');
const backendApiUrl = 'https://eragon-backend1.onrender.com/api/products/';
const siteHostname = 'https://discountregion.com';

async function generateRoutes() {
  const staticRoutes = [
    '/',
    '/stores',
    '/submit-store',
    '/contact',
    '/terms-of-service',
    '/privacy',
    '/affiliate-disclosure',
  ];

  try {
    const productsRes = await fetch(backendApiUrl);
    if (!productsRes.ok) {
      console.error(`[Pre-render] Failed to fetch products: HTTP error! status: ${productsRes.status}`);
      return staticRoutes;
    }
    const rawProductsData = await productsRes.json();
    const products = Array.isArray(rawProductsData) ? rawProductsData : rawProductsData.results || [];

    const productRoutes = products.map(p => `/store/${p.id}/${slugify(p.name)}/`);

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error(`[Pre-render] Error fetching dynamic routes: ${error.message}`);
    return staticRoutes; // Fallback to static routes if API fetch fails
  }
}

async function preRenderAndGenerateSitemap() {
  console.log('[Pre-render] Starting pre-rendering and sitemap generation...');

  // 1. Get all routes to render
  const routesToRender = await generateRoutes();
  console.log(`[Pre-render] Discovered ${routesToRender.length} routes.`);

  // 2. Build the Vite app (if not already built by previous step)
  // This is typically handled by `npm run build` before this script runs.
  // We can skip `build()` here if we assume `vite build` already ran.

  // 3. Start a local server to serve the 'dist' folder
  const vitePreviewServer = await preview({
    preview: {
      port: 5000, // Choose an available port
      open: false,
    },
    // The base config for vite, ensure it looks at the dist folder for preview
    root: projectRoot, // Vite expects the root to be the project root
    build: {
      outDir: 'dist',
    }
  });

  const baseUrl = `http://localhost:${vitePreviewServer.config.preview.port}`;
  console.log(`[Pre-render] Serving built app at ${baseUrl}`);

  // 4. Launch Playwright headless browser
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  const sitemapUrls = []; // To collect URLs for the sitemap

  for (const route of routesToRender) {
    const url = `${baseUrl}${route}`;
    const outputPath = path.join(distDir, route, 'index.html'); // e.g., dist/stores/index.html

    try {
      console.log(`[Pre-render] Visiting ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' }); // Wait for network to be idle
      const htmlContent = await page.content(); // Get the full HTML content

      // Ensure directory exists for output
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, htmlContent);
      console.log(`[Pre-render] Saved ${outputPath}`);

      // Add to sitemap list, using the public domain
      sitemapUrls.push(`${siteHostname}${route}`);

    } catch (error) {
      console.error(`[Pre-render] Failed to render ${url}: ${error.message}`);
    }
  }

  // 5. Generate Sitemap XML
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`[Pre-render] Generated sitemap.xml at ${sitemapPath}`);

  // 6. Generate robots.txt
  const robotsTxtContent = `User-agent: *
Allow: /
Sitemap: ${siteHostname}/sitemap.xml
`;
  const robotsTxtPath = path.join(distDir, 'robots.txt');
  fs.writeFileSync(robotsTxtPath, robotsTxtContent);
  console.log(`[Pre-render] Generated robots.txt at ${robotsTxtPath}`);


  // 7. Clean up
  await browser.close();
  await vitePreviewServer.close();
  console.log('[Pre-render] Pre-rendering and sitemap generation complete!');
}

preRenderAndGenerateSitemap().catch(console.error);