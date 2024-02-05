import { encode as base64Encode } from "https://deno.land/std@0.203.0/encoding/base64.ts";

import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";

const debug = Debug("app:csrf");

export const generateToken = () => {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);

  return base64Encode(array);
};

export function checkToken(ctx, tokenName, formToken, navigateTo) {
  const token = ctx.token.get(tokenName);
  // debug("@submitAddReg(ctx).---> data._csrf --->", data._csrf);
  debug("@checkToken.---> token --->", token);
  if (token !== formToken) {
    ctx.response.status = 303;
    ctx.response.headers["location"] = ctx.url.origin + navigateTo;
    ctx.token.delete(tokenName);
    return ctx;
  }
  ctx.token.delete(tokenName);
}
