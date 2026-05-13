export async function GET() {
  return Response.json({ ok: true, service: 'bizboard-next', timestamp: new Date().toISOString() });
}
