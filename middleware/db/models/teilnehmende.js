// https://www.freecodecamp.org/news/how-to-use-mysql-in-deno-oak/

import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
const debug = Debug("app:model");

/**
 * Adds a new zuschauer item to zuschauer table
 * @param data
 * @param db
 *
 */

export async function addToDB(db, data) {
  debug("@addToDB. data--->  %O", data);

  const TABLE = `teilnehmende`;
  const result = await db.execute(
    `INSERT INTO ${TABLE} SET name=?, email=?, feedback=?, block=?`,
    [data.name, data.email, data.feedback, data.block]
  );
  console.log(result.lastInsertId);
  // { affectedRows: 1, lastInsertId: 1 }
  return result.lastInsertId;
}

/**
 * return true if bigger than 1
 * @param email
 * @param db

 */
export async function getdoublicateEmailDB(db, email) {
  const TABLE = `teilnehmende`;

  const [result] = await db.query(
    `SELECT COUNT(*) count FROM ${TABLE} WHERE email = ? LIMIT 6`,
    [email]
  );
  debug("@getdoublicateEmailDB. result.count--->  %O", result.count);

  return result.count >= 6;
}

/**
 * return random value from db
 * @param db
 *
 */
export async function getRandomEntryDB(db) {
  const TABLE = `teilnehmende`;

  const [result] = await db.query(
    `SELECT * FROM ${TABLE} ORDER BY RANDOM() LIMIT 1`
  );
  debug("@getdoublicateEmailDB. result.count--->  %O", result);

  return result;
}
