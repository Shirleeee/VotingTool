import * as controller from "../src/controller.js";
import * as sessionsControl from "./../middleware/sessions.js";
import { routes } from "./router.js";
import * as serve from "./../middleware/servestatic.js";

import {
  CookieMap,
  mergeHeaders,
} from "https://deno.land/std@0.203.0/http/mod.ts";
import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
const debug = Debug("app:app");

import nunjucks from "https://deno.land/x/nunjucks@3.2.4/mod.js";
nunjucks.configure("templates", {
  autoescape: true,
  noCache: true,
});

const sessionStore = new Map();
const tokenMap = new Map();

import * as client from "../middleware/db/client.js";

export const handleRequest = async (request) => {
  const ctx = {
    db: client.default,
    sessionStore: sessionsControl.createSessionStore(sessionStore),
    cookies: new CookieMap(request),
    token: tokenMap,
    state: {
      authenticated: false,
    },
    session: {},
    request: request,
    url: new URL(request.url),
    params: {},
    redirect: undefined,
    response: {
      headers: {},
      body: undefined,
      status: undefined,
    },
    nunjucks: nunjucks,
  };

  // debug(
  //   "@handle.>>>>>>  %O   ",
  //   `>>>handle -----------${ctx.request.method} ${ctx.url.pathname}${ctx.url.search}`
  // );

  const middleware = [
    sessionsControl.getSession,
    serve.serveStaticFile("public"),
    routes,
    sessionsControl.setSession,
  ];

  const pipeAsync =
    (...funcs) =>
    (ctx) =>
      funcs.reduce(async (state, func) => func(await state), ctx);

  let result = await pipeAsync(...middleware)(ctx);
  // debug("@handleRequest.>>>>>>  %O   ", `>>> result`, result.db);
  if (result.redirect) {
    return result.redirect;
  }

  // Fallback
  result.response.status = result.response.status ?? 404;
  if (!result.response.body && result.response.status == 404) {
    result = await controller.error(result);
  }

  const allHeaders = mergeHeaders(result.response.headers, result.cookies);
  result.response.headers["Set-cookie"] = allHeaders.get("set-cookie");

  // debug("@getSession.----------   allHeaders----> %O  ", allHeaders);
  return new Response(result.response.body, {
    status: result.response.status,
    headers: result.response.headers,
  });
};
