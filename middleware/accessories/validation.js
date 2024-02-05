import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
import * as zuschauerModel from "../db/models/teilnehmende.js";
const debug = Debug("app:validation");

const isValidNameTextLength = (text) => text.length <= 120;
const isValidMailLength = (text) => text.length <= 254;
const isValidFeedbackTextLength = (text) => text.length <= 455;
// function isValidEmail(email) {
//   const re =
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(String(email).toLowerCase());
// }
let count = 0;
///////////////////////////////////////////////////////
export async function validateParticipation(ctx, data) {
  let errors = {};
  // debug("@validateParticipation. data--->  %O", data);

  if (data.datasec === null) {
    errors.datasec = "Die Einwilligung der Datenschutzerklärung ist notwendig";
  }

  if (!isValidNameTextLength(data.name)) {
    errors.name = "Das sind zu viele Zeichen. Max. 120 Zeichen.";
  }

  if (!isValidFeedbackTextLength(data.feedback)) {
    errors.feedback = "Das sind zu viele Zeichen. Max. 455 Zeichen.";
  }
  if (!isValidMailLength(data.email) && data.email) {
    errors.email1 = "Das sind zu viele Zeichen. Max. 254 Zeichen.";
  }

  if (data.email === "") {
  } else if (await zuschauerModel.getdoublicateEmailDB(ctx.db, data.email)) {
    errors.email2 = "Diese E-Mail-Adresse wurde bereits verwendet.";
  }
  // if (!isValidEmail(data.email)) errors.email = "Das ist keine E-Mail.";
  const errorSession = ctx.sessionStore.get("errorFilm");

  debug("@validateParticipation. errorSession--->  %O", errorSession);
  debug("@validateParticipation. data.filmValues--->  %O", data.filmValues);

  if (!errorSession) {
    let foundZero = false;
    data.filmValues.forEach(function (value) {
      if (value === 0) {
        errors.film =
          "Da sind einer oder mehrere Filme mit 0 Punkte bewertet worden. Willst du diesen Filmen auch noch Punkte geben? Wenn nicht drücke einfach auf Absenden";

        ctx.sessionStore.set("errorFilm", true, 3600000);

        foundZero = true;
        return;
      }
    });


    if (count === 2) {
      ctx.sessionStore.destroy("errorFilm");

      count = 0;
    }
    if (foundZero) {
      count++;
    }
  }
  count = 0;

  return errors;
}
