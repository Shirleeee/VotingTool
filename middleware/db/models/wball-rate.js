// https://www.freecodecamp.org/news/how-to-use-mysql-in-deno-oak/

import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
const debug = Debug("app:wball-rate");

/**
 * adds votes for a block
 * @param db
 * @param data
 */
export async function addVotesToDB(db, data) {
  debug("@addToDB. data--->  %O", data);

  const TABLE = `pollvotes`;
  const result = await db.execute(
    `INSERT INTO ${TABLE} SET film1=?, film2=?, film3=?, film4=?, film5=?, film6=?, film7=?, film8=?, film9=?, film10=?, film11=?, film12=?, block=?, dateTime=? `,
    [
      data.filmValues.get("1"),
      data.filmValues.get("2"),
      data.filmValues.get("3"),
      data.filmValues.get("4"),
      data.filmValues.get("5"),
      data.filmValues.get("6"),
      data.filmValues.get("7"),
      data.filmValues.get("8"),
      data.filmValues.get("9"),
      data.filmValues.get("10"),
      data.filmValues.get("11"),
      data.filmValues.get("12"),
      data.block,
      data.dateTime,
    ]
  );
  console.log(result.lastInsertId);
  return result.lastInsertId;
}

/**
 * return sum all votings for each film in block and returns an array of objects with calucalated values
 * @param db
 * @param block
 */

export async function sumAllVotingsbyBlock(db, block) {
  const TABLE = `pollvotes`;
  const result = await db.query(
    `SELECT
    SUM(film1),
    SUM(film2),
    SUM(film3),
    SUM(film4),
    SUM(film5),
    SUM(film6),
    SUM(film7),
    SUM(film8),
    SUM(film9),
    SUM(film10),
    SUM(film11),
    SUM(film12)   
    FROM ${TABLE} WHERE block = ?`,
    [block]
  );

  return result;
}

/**
 * return number of votes by  block
 * @param db
 * @param block
 *
 */
export async function countVotesByBlock(db, block) {
  const TABLE = `pollvotes`;

  const [result] = await db.query(
    `SELECT COUNT(*) count FROM ${TABLE} WHERE block = ? GROUP BY block`,
    [block]
  );
  // debug("@countVotesbyBlock. result.count--->  %O", result?.count);

  return result?.count === undefined ? parseInt("0") : result?.count;
}
