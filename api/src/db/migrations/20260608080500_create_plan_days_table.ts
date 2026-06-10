import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("plan_days", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());

    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .uuid("user_plan_id")
      .notNullable()
      .references("id")
      .inTable("user_plans")
      .onDelete("CASCADE");

    table.string("name").notNullable();
    table.integer("day_number").notNullable();
    table.unique(["user_plan_id", "day_number"], {
      indexName: "plan_days_user_plan_id_day_number_unique",
    });
    table.check(
      "day_number between 0 and 6",
      [],
      "plan_days_day_number_check",
    );

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("plan_days");
}
