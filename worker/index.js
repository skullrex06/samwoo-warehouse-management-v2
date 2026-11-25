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

    if (request.method === "GET" && url.pathname === "/api/stock") {
      try {
        const result = await env.DB
          .prepare("SELECT * FROM stock LIMIT 500")
          .all();

        return Response.json({
          success: true,
          data: result.results,
        });
      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message,
          },
          { status: 500 }
        );
      }
    }

    return Response.json({
      message: "Samwoo Warehouse API",
      health: "/api/health",
      stock: "/api/stock",
    });
  },
};
