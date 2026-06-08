import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("messages", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());

    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .uuid("thread_id")
      .notNullable()
      .references("id")
      .inTable("chat_threads")
      .onDelete("CASCADE");

    table.enum("role", ["Assistant", "Human"]).notNullable();

    table.jsonb("content").notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("messages");
}
