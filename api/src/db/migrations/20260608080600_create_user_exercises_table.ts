import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_exercises", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());

    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .uuid("plan_day_id")
      .notNullable()
      .references("id")
      .inTable("plan_days")
      .onDelete("CASCADE");

    table
      .uuid("exercise_id")
      .notNullable()
      .references("id")
      .inTable("exercises")
      .onDelete("CASCADE");

    table.integer("reps");
    table.integer("sets");
    table.integer("rest");
    table.boolean("is_completed").notNullable().defaultTo(false);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_exercises");
}
