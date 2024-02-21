import * as zuschauerModel from "../middleware/db/models/teilnehmende.js";
import * as voteModel from "../middleware/db/models/wball-rate.js";
import * as filmeModel from "../middleware/db/models/wball-films.js";
import * as calc from "./../middleware/accessories/calculations.js";

import * as csrf from "./../middleware/accessories/csrf.js";
import * as valid from "../middleware/accessories/validation.js";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";
import * as sessions from "../middleware/sessions.js";
import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";

const debug = Debug("app:controller");

export async function wblock_add(ctx) {
  const token = csrf.generateToken();
  ctx.token.set("tokenBlocks", token);
  debug("@wblock_add. token-->  %O", token);

  const block = await filmeModel.getBlocknameByUrlids(ctx.db, ctx.params.urlid);

  if (block === undefined || block === null || block.length === 0) {
    return await error(ctx);
  }
  const blockname = block[0].block;

  const wbFilme = await filmeModel.getAllFilmsByBlock(ctx.db, blockname);

  ctx.response.body = ctx.nunjucks.render("block.html", {
    form: {
      csrf: token,
    },
    films: wbFilme,
    blockname: blockname,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";

  return ctx;
}

export async function wblock_submit(ctx) {
  const block = await filmeModel.getBlocknameByUrlids(ctx.db, ctx.params.urlid);
  if (block === undefined || block === null || block.length === 0) {
    return await error(ctx);
  }
  const blockname = block[0].block;

  const formData = await ctx.request.formData();

  debug("@wblock_submit.  --formData--> %O", formData);

  const wbFilme = await filmeModel.getAllFilmsByBlock(ctx.db, blockname);

  const filmMap = new Map();
  for (let i = 1; i <= wbFilme.length; i++) {
    const num = i.toString();
    const value =
      formData.get("film" + num) === null
        ? parseInt("0")
        : formData.get("film" + num);
    filmMap.set(num, value);
  }
  const dateTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  const data = {
    filmValues: filmMap,
    block: blockname,
    name: formData.get("name"),
    email: formData.get("email"),
    feedback: formData.get("feedback"),
    dateTime: dateTime,
    datasec: formData.get("datasec"),
    _csrf: formData.get("_csrf"),
  };

  const errors = await valid.validateParticipation(ctx, data);

  if (Object.values(errors).length > 0) {
    ctx.response.body = ctx.nunjucks.render("block.html", {
      films: wbFilme,
      data: data,
      errors: errors,
      blockname: blockname,
      voteStation: ctx.params.voteStation,
    });
    ctx.response.status = 200;
    ctx.response.method = "GET";
    ctx.response.headers["content-type"] = "text/html";

    return ctx;
  }

  csrf.checkToken(ctx, "tokenBlocks", data._csrf, "/error");

  if ((!(data.email === "") && !(data.name === "")) || data.feedback) {
    await zuschauerModel.addToDB(ctx.db, data);
  }
  await voteModel.addVotesToDB(ctx.db, data);

  sessions.deleteAllSessionsCookiesTokens(ctx);

  ctx.response.body = ctx.nunjucks.render("thankyou.html", {
    name: data.name,
    block: data.block,
    voteStation: ctx.params.voteStation,
    relink: ctx.params.href,
  });
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export async function error(ctx) {
  ctx.response.body = ctx.nunjucks.render("error.html", {});
  ctx.response.status = 404;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export async function datenschutz(ctx) {
  ctx.response.body = ctx.nunjucks.render("datenschutz.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export async function index(ctx) {
  ctx.response.body = ctx.nunjucks.render("index.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}
export async function impressum(ctx) {
  ctx.response.body = ctx.nunjucks.render("impressum.html", {});
  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}

export async function evaluation(ctx) {
  const blockname = ctx.params.blockname;

  const alltheBlocks = await filmeModel.getAllBlocks(ctx.db);
  // debug("@evaluation. alltheBlocks %O", alltheBlocks);
  const overallWinnerMC = await calc.getMainContestWinner(ctx.db, alltheBlocks);

  const filmObjects = await calc.calcBestOfBlock(ctx.db, blockname);

  const amountVotesByBlock = await voteModel.countVotesByBlock(
    ctx.db,
    blockname
  );

  ctx.response.body = ctx.nunjucks.render("evaluation.html", {
    filmObj: filmObjects,
    winnerMC: overallWinnerMC,
    amountVotesByBlock: amountVotesByBlock,
    currentBlock: blockname,
    alltheBlocks: alltheBlocks,
  });

  ctx.response.status = 200;
  ctx.response.headers["content-type"] = "text/html";
  return ctx;
}
