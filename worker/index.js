const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: corsHeaders,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method === "GET" && url.pathname === "/api/health") {
      return jsonResponse({
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

        return jsonResponse({
          success: true,
          data: result.results,
        });
      } catch (error) {
        return jsonResponse(
          { success: false, error: error.message },
          500
        );
      }
    }

    return jsonResponse({
      message: "Samwoo Warehouse API",
      health: "/api/health",
      stock: "/api/stock",
    });
  },
};
