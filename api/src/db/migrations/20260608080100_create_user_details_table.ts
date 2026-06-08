import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_details", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());

    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");

    table.string("gender");
    table.integer("age");
    table.decimal("weight", 6, 2);
    table.decimal("height", 6, 2);
    table.string("workout_environment");
    table.string("workout_goal");

    table.jsonb("memory").nullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_details");
}
