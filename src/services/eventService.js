const Knex = require("../db/knex");
const tableNames = require("../constants/tableNames");
const tableName = tableNames.event;
/**
 * @param {Knex} knex
 */

function create() {}
async function getAll({ name = null, type = "" }) {
  if (name) {
    return await Knex(tableName)
      .select()
      .where(`${tableName}.name`, "ilike", `%${name}%`);
  }
  if (type) {
    return await Knex(tableName)
      .select()
      .where(`${tableName}.type`, "ilike", `%${type}%`);
  }
  return await Knex(tableName).select();
}
function updateById() {}
function deleteById() {}

async function upsert(data) {
  if (data.id == null) {
    // create
    return await Knex(tableName)
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .returning("*");
  } else {
    //update
    return await Knex(tableName)
      .where("id", "=", data.id)
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .returning("*");
  }
}
async function deleteById(id) {
  return await Knex(tableName).where("id", "=", id).del();
}

module.exports = {
  create,
  upsert,
  getAll,
  updateById,
  deleteById,
};
