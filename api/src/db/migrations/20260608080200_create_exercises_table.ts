import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("exercises", (table) => {
    table.string("id").primary().defaultTo(knex.fn.uuid());

    table.string("name");
    table.string("force");
    table.string("level");
    table.string("mechanic");
    table.string("equipment");

    table.jsonb("primary_muscles");
    table.jsonb("secondary_muscles");
    table.jsonb("images");

    table.jsonb("instructions");
    table.string("category");

    table.timestamps(true, true);
  });

  await knex.raw(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("exercises");
  await knex.raw(`DROP EXTENSION IF EXISTS pg_trgm`);
}
