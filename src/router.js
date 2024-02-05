import * as controller from "./controller.js";
import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
import { URLPattern } from "https://deno.land/x/url_pattern/mod.ts";
const debug = Debug("app:router");

export async function routes(ctx) {
  const url = new URL(ctx.request.url);

  // debug("@wettbewerbsblock1. GET url-->  %O", url);
  if (url.pathname == "/impressum") {
    return controller.impressum(ctx);
  }

  if (url.pathname == "/datenschutz") {
    return controller.datenschutz(ctx);
  }

  if (url.pathname == "/qZaa3") {
    return controller.index(ctx);
  }

  if (url.pathname.match(/\/evaqZaa3\/.*/) && ctx.request.method == "GET") {
    const matches = ctx.url.pathname.match(/\/evaqZaa3\/(.*)/);
    ctx.params.blockname = matches[1];

    debug("@wettbewerbsblock1. GET matches-->  %O", matches);
    return await controller.evaluation(ctx);
  }

  // ////! GET
  const pattern = new URLPattern("/wb/:urlid/:station");

  if (pattern.match(url.pathname) && ctx.request.method == "GET") {
    const matches = pattern.match(url.pathname);
    debug("@router. GET matches-->  %O", matches);
    // ctx.params.href = url.href;
    ctx.params.voteStation = matches.station;
    ctx.params.urlid = matches.urlid;

    debug("@router. GET ctx.params.urlid-->  %O", ctx.params.urlid);

    return await controller.wblock_add(ctx);
  }

  // POST
  if (pattern.match(url.pathname) && ctx.request.method == "POST") {
    const matches = pattern.match(url.pathname);

    ctx.params.urlid = matches.urlid;
    ctx.params.voteStation = matches.station;
    ctx.params.href = url.href;

    debug("@wettbewerbsblock1. POST matches-->  %O", matches);

    return await controller.wblock_submit(ctx);
  }
  return ctx;
}
