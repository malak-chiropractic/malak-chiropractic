/**
 * Called once a day by Vercel Cron (see vercel.json) to rebuild the site,
 * so articles scheduled for a future publish date appear on that day.
 * Requires DEPLOY_HOOK_URL (Vercel → Settings → Git → Deploy Hooks) and CRON_SECRET.
 */
export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorised", { status: 401 });
  }
  const hook = process.env.DEPLOY_HOOK_URL;
  if (!hook) return Response.json({ ok: false, error: "DEPLOY_HOOK_URL not set" }, { status: 503 });
  const res = await fetch(hook, { method: "POST" });
  return Response.json({ ok: res.ok });
}
