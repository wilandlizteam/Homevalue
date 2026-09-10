/**
 * Vercel serverless function — POST /api/lead
 *
 * The browser posts the lead here; this function adds the Follow Up Boss
 * credential (from an environment variable) and forwards it. The key never
 * leaves the server.
 *
 * The request/response shapes are declared locally rather than imported from
 * `@vercel/node`. That package was pulled in for two type names only, and it
 * dragged five known vulnerabilities and a large install into every deploy.
 * These structural types describe exactly what this handler touches, so they
 * satisfy the runtime's actual contract without the dependency.
 *
 * NOTE ON THE IMPORT BELOW — it must end in `.js`, not `.ts`.
 * The host compiles this file to api/lead.js and runs THAT, but it does not
 * rewrite import specifiers. So the specifier has to name the file as it will
 * exist at runtime (lead-core.js), not as it exists in the repo
 * (lead-core.ts). TypeScript understands this and resolves `.js` back to the
 * `.ts` source when type-checking. Writing `./_lib/lead-core.ts` here type-
 * checks fine and then fails in production with
 *   ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/api/_lib/lead-core.ts'
 */

import { handleLead, type LeadPayload } from './_lib/lead-core.js';

type NodeRequest = {
  method?: string;
  body?: unknown;
};

type NodeResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): { json(body: unknown): unknown };
};

export default async function handler(req: NodeRequest, res: NodeResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  const body: LeadPayload =
    typeof req.body === 'string'
      ? safeParse(req.body)
      : ((req.body ?? {}) as LeadPayload);

  const result = await handleLead(body);

  res.setHeader('Cache-Control', 'no-store');
  return res.status(result.status).json(result.body);
}

function safeParse(raw: string): LeadPayload {
  try {
    return JSON.parse(raw) as LeadPayload;
  } catch {
    return {};
  }
}
