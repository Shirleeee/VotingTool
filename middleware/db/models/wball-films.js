import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
const debug = Debug("app:wball-films");

/**
 * get all from filme
 * @param block
 */

export const getAllFilmsByBlock = async (db, block) => {
  const TABLE = `filme`;

  const result = await db.query(`SELECT * FROM ${TABLE} WHERE block= ?`, [
    block,
  ]);

  return result;
};

/**
 * get blockid from filme
 * @param db
 * @param block
 */

export const getAllBlockIdByBlock = async (db, block) => {
  const TABLE = `filme`;

  // debug("@getallblockidbyblock.ctx.db -->  %O", ctx.db);
  return db.query(`SELECT blockid FROM ${TABLE} WHERE block= ?`, [block]);
};

/**
 * get all blocks from filme one of each
 * @param db
 *
 */

export const getAllBlocks = async (db) => {
  const TABLE = `filme`;

  return db.query(`SELECT block FROM ${TABLE} GROUP BY block`);
};

/**
 * get block by urlid
 * @param db
 * @param urlid
 *
 *
 */

export const getBlocknameByUrlids = async (db, urlid) => {
  const TABLE = `filme`;

  // debug("@getallblockidbyblock.ctx.db -->  %O", ctx.db);
  const block = db.query(
    `SELECT block FROM ${TABLE} WHERE urlid= ? GROUP BY block`,
    [urlid]
  );
  // debug("@getblocknamebyurlids. block-->  %O", block);

  return block;
};
