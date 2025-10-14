import database from "infra/database.js";

async function status(request, response) {
  const databaseVersion = await database.query("SHOW server_version;");

  const maxConnections = await database.query("SHOW max_connections;");

  const activeConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });

  response.status(200).json({
    updated_at: new Date().toISOString(),
    dependencies: {
      database: {
        version: databaseVersion.rows[0].server_version,
        max_connections: parseInt(maxConnections.rows[0].max_connections),
        opened_connections: activeConnections.rows[0].count,
      },
    },
  });
}

export default status;
