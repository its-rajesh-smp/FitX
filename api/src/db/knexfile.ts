import dotenv from "dotenv";
import { Knex } from "knex";
import { knexSnakeCaseMappers } from "objection";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const isProduction = process.env.NODE_ENV === "production";

const connection = {
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE || process.env.POSTGRES_DB,
  ...(isProduction && {
    ssl: { rejectUnauthorized: false },
  }),
};

const config: Knex.Config = {
  client: "pg",
  connection,
  migrations: {
    directory: "./migrations",
    extension: "ts",
  },
  seeds: {
    directory: "./seeds",
    extension: "ts",
  },
  ...knexSnakeCaseMappers(),
};

const knexConfig: { [key: string]: Knex.Config } = {
  development: config,
  test: config,
  production: config,
};

export default knexConfig;
