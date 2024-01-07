require("dotenv").config({ path: "../../../../config/.env.dev" });

const PG_CONNECTION_STRING = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@store:5432/${process.env.POSTGRES_DB}`;
console.log(PG_CONNECTION_STRING);
module.exports = {
  client: "pg",
  connection: PG_CONNECTION_STRING,
  migrations: {
    tableName: "knex_migrations",
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
    // Define a sorting function to order the seed files numerically
    sortDirs: true,
    sort: (a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  },
};
