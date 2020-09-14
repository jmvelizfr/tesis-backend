const Knex = require("../db/knex");
const tableNames = require("../constants/tableNames");
const tableName = tableNames.checkIn;
const GuestTableName = tableNames.guest;
const RoomTableName = tableNames.room;
/**
 * @param {Knex} knex
 */

async function create(data) {
  return await Knex(tableName)
    .insert({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .returning("*");
}

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

async function getAll({ name = null }) {
  let checkIns = [];
  if (name) {
    checkIns = await Knex(tableName)
      .select()
      .where(`${tableName}.name`, "ilike", `%${name}%`);
  } else {
    checkIns = await Knex(tableName).select();
  }
  let populatedCheckIns = [];
  for await (const checkIn of checkIns) {
    const [room] = await Knex(RoomTableName)
      .select()
      .where(`id`, "=", checkIn.room_id);
    const [guest] = await Knex(GuestTableName)
      .select()
      .where(`id`, "=", checkIn.guest_id);
    populatedCheckIns.push({
      ...checkIn,
      room,
      guest,
    });
  }
  return populatedCheckIns;
}
function updateById() {}

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
