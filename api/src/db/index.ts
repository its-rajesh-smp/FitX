import { env } from "@config/env";
import knex, { Knex } from "knex";
import { Model } from "objection";
import knexConfig from "./knexfile";

export const db: Knex = knex(knexConfig[env.ENVIRONMENT]);
Model.knex(db);

export const runDBMigrations = async () => {
  console.log("Database migrations started");
  await db.migrate.latest();
  console.log("Database migrations completed");
};
