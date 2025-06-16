// scripts/prerender.js


import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { preview } from 'vite'; // To serve the built app locally
import playwright from 'playwright'; // Import Playwright

const slugify = (text) => {
  if (!text) return '';
  return String(text)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/-+$/, '');
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); // Points to Coupon_Web root
const distDir = path.join(projectRoot, 'dist');
const backendApiUrl = 'https://eragon-backend1.onrender.com/api/products/';
const siteHostname = 'https://www.discountregion.com'; // Your actual live domain (include https://)

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
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 50000); // 50-second timeout for cold start

    const productsRes = await fetch(backendApiUrl, {
      signal: controller.signal
    });
    clearTimeout(id); // Clear timeout if fetch succeeds

    if (!productsRes.ok) {
      console.error(`[Pre-render] Failed to fetch products: HTTP error! status: ${productsRes.status}`);
      return staticRoutes;
    }
    const rawProductsData = await productsRes.json();
    const products = Array.isArray(rawProductsData) ? rawProductsData : rawProductsData.results || [];

    const productRoutes = products.map(p => `/store/${p.id}/${slugify(p.name)}/`);

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('[Pre-render] Error fetching dynamic routes: Fetch timed out (cold start likely).');
    } else {
      console.error(`[Pre-render] Error fetching dynamic routes: ${error.message}`);
    }
    return staticRoutes; // Fallback to static routes if API fetch fails
  }
}

async function preRenderAndGenerateSitemap() {
  console.log('[Pre-render] Starting pre-rendering and sitemap generation...');
  console.log(`[Pre-render] Target dist directory: ${distDir}`);

  // 1. Get all routes to render
  const routesToRender = await generateRoutes();
  console.log(`[Pre-render] Discovered ${routesToRender.length} routes.`);

  // 2. Start a local server to serve the 'dist' folder
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

  // 3. Launch Playwright headless browser
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  // --- NEW: Expose a global variable to the page context ---
  // This function will be callable from the page's JavaScript (your React app)
  await page.exposeFunction('getPrerenderLiveBaseUrl', () => siteHostname);
  // --- END NEW ---

  const sitemapUrls = []; // To collect URLs for the sitemap

  for (const route of routesToRender) {
    const url = `${baseUrl}${route}`; // This 'baseUrl' is localhost:5000 during pre-render
    const outputPath = path.join(distDir, route, 'index.html'); // e.g., dist/stores/index.html

    try {
      console.log(`[Pre-render] Visiting ${url}`);
      // Initial navigation
      await page.goto(url, { waitUntil: 'domcontentloaded' }); // Use domcontentloaded for faster initial nav

      // --- CRITICAL FIX: Wait for the data-prerender-ready attribute ---
      // This waits until your React component confirms its data is loaded and rendered.
      // Set a generous timeout in case backend is slow.
      await page.waitForSelector('[data-prerender-ready="true"]', { timeout: 60000 }); // Wait up to 60 seconds
      // --- END CRITICAL FIX ---
      
      const htmlContent = await page.content(); // Get the full HTML content

      // Ensure directory exists for output
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, htmlContent);
      console.log(`[Pre-render] Saved ${outputPath}`);

      // Add to sitemap list, using the public domain
      sitemapUrls.push(`${siteHostname}${route}`);

    } catch (error) {
      console.error(`[Pre-render] Failed to render ${url}: ${error.message}`);
      // Continue to next route even if one fails to render
    }
  }

  // 4. Generate Sitemap XML
  console.log('[Pre-render] Attempting to generate sitemap.xml...');
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  console.log(`[Pre-render] Writing sitemap.xml to: ${sitemapPath}`);
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`[Pre-render] Generated sitemap.xml successfully.`);

  // 5. Generate robots.txt
  const robotsTxtContent = `User-agent: *
Allow: /
Sitemap: ${siteHostname}/sitemap.xml
`;
  const robotsTxtPath = path.join(distDir, 'robots.txt');
  console.log(`[Pre-render] Writing robots.txt to: ${robotsTxtPath}`);
  fs.writeFileSync(robotsTxtPath, robotsTxtContent);
  console.log(`[Pre-render] Generated robots.txt successfully.`);


  // 6. Clean up
  await browser.close();
  await vitePreviewServer.close();
  console.log('[Pre-render] Pre-rendering and sitemap generation complete!');
}

preRenderAndGenerateSitemap().catch(console.error);