/**
 * Angular SSR Server
 *
 * This server runs on the Bun runtime for maximum performance.
 * Express is used for middleware compatibility with @angular/ssr/node.
 *
 * Note: Angular SSR currently requires Express for its Node.js adapter.
 * When @angular/ssr adds native Bun support, this can be migrated to Bun.serve().
 */

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import apiRoutes from './api/routes';
import { getEnvNumber } from './config/env.config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 * Mount API routes with /api/v1/admin-ui prefix
 */
app.use('/api/v1/admin-ui', apiRoutes);

/**
 * Serve static files from /browser
 * Note: In production, static files are typically served by a CDN or reverse proxy
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * Runs on Bun runtime with Express for Angular SSR compatibility.
 */
if (isMainModule(import.meta.url)) {
  const port = getEnvNumber('PORT', 4000)!;

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
    console.log(`Runtime: Bun ${Bun.version}`);
    console.log(`Environment: ${Bun.env['NODE_ENV'] || 'development'}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
