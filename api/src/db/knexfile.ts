import { Knex } from "knex";
import { knexSnakeCaseMappers } from "objection";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
    ...knexSnakeCaseMappers(),
  },
};

export default knexConfig;
