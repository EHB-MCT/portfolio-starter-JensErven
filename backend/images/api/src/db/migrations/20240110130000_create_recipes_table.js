exports.up = function (knex) {
  return knex.schema.createTable("recipes", function (table) {
    table.uuid("id").primary();
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.string("recipe_name", 255).notNullable();
    table.text("description");
    table.jsonb("instructions");
    table.jsonb("ingredients");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("recipes");
};
