const diceRoll = require('./diceRoller.js');
const isnum = require('./isNumeric.js');

module.exports = {
  OVADice: function(number) {
    if (!isnum.isNumeric(number[0])) {
      return "What does that even mean? Gotta be a positive number of dice, chief.";
    }
    let results = diceRoll.diceRoller(number, 6);
    let i = 0;
    let totals = [0, 0, 0, 0, 0, 0];
    while (i < 6) { /*This whole section loops through the results array and finds how many times each number from 1-6 appears there. It stores that in the totals array, in the appropriate index (1 is in [0], 2 in [1], etc)*/
      for(let j = 0; j < results.length; ++j) {
        if (results[j] == i+1) {
          ++totals[i];
        }
      }
      ++i;
    }
    console.log(totals);
    let total = 0;
    let multiplier = 0;
    for (i=1; i < 7; ++i) { //goes through the array created above and multiplies out results to find the highest total. Stores the multiplier for that as well.
      if (totals[i-1]*i > total) {
        total = totals[i-1]*i;
        multiplier = i;
        console.log(total);
      }
    }
    let textResults = "[";
    for (i=0; i<results.length; ++i) {
      if (results[i] == multiplier) {
        textResults = textResults + "**" + results[i].toString() + "**" + ", "
      }
      else {
        textResults = textResults + results[i].toString() + ", "
      }
    }
    textResults = textResults.slice(0, -2);
    textResults = textResults + "] = " + total.toString();
    return textResults;
  }
};
