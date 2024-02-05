import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
const debug = Debug("app:calculations");
import * as filmeModel from "./../db/models/wball-films.js";
import * as voteModel from "./../db/models/wball-rate.js";

function parseToNum(sumVotesbyBlockObject) {
  return Object.values(sumVotesbyBlockObject).map((value) => {
    if (value === null) {
      value = 0;
    }
    const parsedValue = parseInt(value);
    return parsedValue;
  });
}

const votes100PercentBlock = (amountVotesByBlock) => {
  const MAX_POINTS = 6;

  return amountVotesByBlock * MAX_POINTS;
};

const calcResults = (value, votesPoint100) => {
  return (value * 100) / votesPoint100;
};

export async function calcBestOfBlock(db, blockname) {
  let result = await voteModel.sumAllVotingsbyBlock(db, blockname);
  // debug("@calcBest. sumAllVotingsbyBlock result %O", result);
  result = result[0];

  //parse all summed votes for each film from string to number, check if null
  const sumVotesbyFilmArray = parseToNum(result);

  //sum all values of its specific block length
  const amountVotesByBlock = await voteModel.countVotesByBlock(db, blockname);

  // calculate max points per block which represents 100%
  const votesPoint100 = votes100PercentBlock(amountVotesByBlock);

  //get film content
  const getFilms = await filmeModel.getAllFilmsByBlock(db, blockname);

  let blockWinner = { value: 0 };

  getFilms.forEach((objekt) => {
    const filmIndex = parseInt(objekt.blockid.split("-")[1], 10);

    if (!isNaN(filmIndex)) {
      sumVotesbyFilmArray.forEach((value, index) => {
        if (index + 1 === filmIndex) {
          const valueRelative = calcResults(value, votesPoint100);

          if (valueRelative > blockWinner.value) {
            blockWinner.film = objekt.filmtitle;
            blockWinner.value = valueRelative;
            blockWinner.blockid = objekt.blockid;
          }
          objekt[`film${filmIndex}`] = value;
          objekt[`percent`] = valueRelative;
        }
      });
    }
    delete objekt.imagepath;
  });

  getFilms.blockWin = blockWinner.value;
  getFilms.blockid = blockWinner.blockid;
  getFilms.blockWinner = blockWinner.film;
  return getFilms;
}

export const getMainContestWinner = async (db, alltheBlocks) => {
  let mainContestWinner = { value: 0 };

  //filtering block for MC
  const acceptedBlocks = ["wb1", "wb2", "wb3", "wb4", "wb5", "wb6", "wbt"];
  const overAllContestBlock = alltheBlocks.filter((item) =>
    acceptedBlocks.includes(item.block)
  );

  for (const b of overAllContestBlock) {
    const film = await calcBestOfBlock(db, b.block);

    if (film.blockWin > mainContestWinner.value) {
      mainContestWinner.blockid = film.blockid;
      mainContestWinner.value = film.blockWin;
      mainContestWinner.blockWinner = film.blockWinner;
    }
  }

  return mainContestWinner;
};
