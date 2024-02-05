// import i18next from "https://cdn.jsdelivr.net/npm/i18next@23.2.1/i18next.min.js";

export const init = () => {
  if (
    "querySelector" in document &&
    "head" in document &&
    "classList" in document.head &&
    "addEventListener" in window
  ) {
    document.addEventListener("DOMContentLoaded", setup);
  }
};

const setup = () => {
  const rerender = () => {
    $("body").localize();
  };

  function trans() {
    // use plugins and options as needed, for options, detail see
    // https://www.i18next.com

    i18next
      // detect user language
      // learn more: https://github.com/i18next/i18next-browser-languageDetector
      .use(i18nextBrowserLanguageDetector)
      // init i18next
      // for all options read: https://www.i18next.com/overview/configuration-options
      .init(
        {
          fallbackLng: "dk",

          resources: {
            dk: {
              translation: {
                block: {
                  nextfilm: "Næste film",

                  further: "Mere",
                  wintext:
                    "Der er 3x2 fribilletter til biografen 51Stufen at vinde. For at kontakte dig har vi brug for din navn og din e-mailadresse. ",

                  yourname: "Din navn",

                  yourmail: "Din e-mail",

                  feedback:
                    "Er der andet, du vil fortælle os? Så kan du slippe af med det her.",
                  infonotice:
                    "(Vi vil ikke bruge dine data til andet end at kontakte dig, hvis du vinder.)",
                  datasec1: `Samtykke til `,
                  datasec2: " privatlivspolitikken*",
                  send: "Send",
                  send2: "Nej, Send",
                  errorFilm:
                    "En eller flere film har stadig 0 point. Vil du også give de andre film point? Hvis ikke, skal du blot trykke på Send igen.",
                  errorFeedback: "Det er for mange tegn. Maks. 455 tegn",
                  errorMail1: "Det er for mange tegn. Maks. 254 tegn",
                  errorMail2: "Denne e-mailadresse er allerede blevet brugt",
                  errorName: "Det er for mange tegn. Maks. 120 tegn",
                  errorDatasec:
                    "Samtykke til privatlivspolitikken er nødvendig",
                },
                thankyou: {
                  thanks: "Mange tak for din deltagelse, ",
                  win: "Vi vender tilbage til dig, når du har vundet.",
                },
              },
            },
          },
        },
        (err, t) => {
          if (err) return console.error(err);

          // for options see
          // https://github.com/i18next/jquery-i18next#initialize-the-plugin
          jqueryI18next.init(i18next, $, { useOptionsAttr: true });

          $("body").localize();

          rerender();
        }
      );
  }

  console.log("🚀 ~ file: i18n.js:141 ~ setup ~ i18next:", i18next);
  trans();
};
