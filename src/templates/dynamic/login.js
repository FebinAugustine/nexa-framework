export async function POST(req) {
    const data = await req.json();
    // Simple validation
    if (data.email && data.password) {
        return Response.json({ ok: true, token: "mock-jwt-token" });
    }
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
}