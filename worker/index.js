export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return Response.json({
        status: "ok",
        service: "samwoo-warehouse-api",
        database: Boolean(env.DB),
      });
    }

    return Response.json({
      message: "Samwoo Warehouse API",
      health: "/api/health",
    });
  },
};
