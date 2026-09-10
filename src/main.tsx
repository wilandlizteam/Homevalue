import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
/*
 * Vercel Analytics — page views and Core Web Vitals for the deployed site.
 *
 * The `/react` subpath is the plain-React entry; `/next` is for Next.js and
 * would fail here. Mounted at the root rather than inside App so it sits
 * outside the funnel's step machine and cannot be unmounted when the visitor
 * moves between steps.
 *
 * It injects /_vercel/insights/script.js, which only exists on a Vercel
 * deployment with Analytics enabled in the project dashboard. Locally and in
 * the test suites that path 404s, which is expected and harmless — the
 * component fails quietly and nothing else is affected.
 *
 * This is separate from and additional to the Meta Pixel in src/lib/pixel.ts.
 * Neither touches the other.
 */
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
);
